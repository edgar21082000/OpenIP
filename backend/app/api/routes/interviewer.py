from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends
from sqlmodel import select

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_interviwer_user,
)
from app.models import Interview, InterviewSlot, InterviewStatus

router = APIRouter()


@router.get(
    "/free-slots", dependencies=[Depends(get_current_interviwer_user)], response_model=list[InterviewSlot]
)
def get_free_slots(*, session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Get all free slot for interviewer.
    """
    query = select(InterviewSlot).where(
                    InterviewSlot.user_id == current_user.id,
                    InterviewSlot.from_datetime >= datetime.utcnow())
    return session.exec(query).all()


@router.post(
    "/free-slots", dependencies=[Depends(get_current_interviwer_user)], response_model=InterviewSlot
)
def create_slot(*, session: SessionDep, free_slot: InterviewSlot) -> Any:
    """
    Create new free slot by interviewer.
    """
    assert free_slot.to_datetime - free_slot.from_datetime >= timedelta(hours=1)
    session.add(free_slot)
    session.commit()
    session.refresh(free_slot)
    return free_slot


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
                'event_datetime': payload.event_datetime,
                'stack_tag': payload.stack_tag,
                'link': payload.link
            } for payload in interviews]


