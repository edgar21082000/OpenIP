from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends
from sqlmodel import select

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_interviwer_user,
)
from app.models import (
    Interview,
    InterviewMark,
    InterviewSlot,
    InterviewSlotCreate,
    InterviewStatus,
    InterviewType,
    MarkCreate,
    User,
)

router = APIRouter()


@router.get(
    "/free-slots"
)
def get_free_slots(*, session: SessionDep) -> Any:
    """
    Get all free slot for interviewer.
    """
    query = select(InterviewSlot, User.email)\
            .join(
                User,
                User.id == InterviewSlot.user_id
            )
    return [{
                'id': item[0].id,
                'from_datetime': str(item[0].from_datetime),
                'duration': item[0].duration,
                'stack': 'python',
                'email': item[1]
            }
            for item in session.exec(query).all()]


@router.post(
    "/free-slots", dependencies=[Depends(get_current_interviwer_user)], response_model=InterviewSlotCreate
)
def create_slot(*, session: SessionDep, current_user: CurrentUser, free_slot: InterviewSlotCreate) -> Any:
    """
    Create new free slot by interviewer.
    """
    slot_to_create = InterviewSlot()
    slot_to_create.from_datetime = free_slot.from_datetime
    slot_to_create.duration = free_slot.duration
    slot_to_create.user_id = current_user.id
    session.add(slot_to_create)
    session.commit()
    return free_slot

'''
type InterviewHistory = {
  date: string;
  summary: string;
  rating: number;
};
'''
@router.get(
    "/assigned_interview", dependencies=[Depends(get_current_interviwer_user)]
)
def get_assigned_interview(*, session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Get all assigned interviews
    """
    query = select(Interview).where(
                Interview.interviewer_id == current_user.id,
                Interview.status.in_(InterviewStatus.waiting, InterviewStatus.in_progress)
            ).order_by(Interview.event_datetime.desc())
    interviews: list[Interview] = session.exec(query).all()
    return [{
                'date': str(payload.event_datetime),
                'summary': 'Soon...',
                'rating': payload.mark
            } for payload in interviews]


@router.post(
    "/create_interview/{slot_id}"
)
def create_interview(*, session: SessionDep, current_user: CurrentUser, slot_id: int) -> Any:
    """
    Create new free slot by interviewer.
    """
    #assert free_slot.to_datetime - free_slot.from_datetime >= timedelta(hours=1)
    interview = Interview()
    slot: InterviewSlot = session.get(InterviewSlot, slot_id)
    interview.applicant_id = current_user.id
    interview.event_datetime = slot.from_datetime
    interview.comments = ''
    interview.link = 'dummylink_to_code_share'
    interview.stack_tag = 'python'
    interview.interviewer_id = slot.user_id
    interview.status = InterviewStatus.waiting
    interview.type = InterviewType.algo
    session.add(interview)
    session.commit()
    return {'status': 'created'}


@router.post(
    "/set_mark"
)
def set_mark(*, session: SessionDep, payload: MarkCreate) -> Any:
    """
    Create new free slot by interviewer.
    """
    interview: Interview = session.get(Interview, payload.interview_id)
    interview.mark = InterviewMark[payload.mark]
    interview.status = InterviewStatus.finished
    session.commit()
    return {'status': 'mark set'}
