from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import case, func
from sqlmodel import select

from app.api.deps import (
    SessionDep,
    get_current_hr_user,
)
from app.models import Interview, InterviewMark, InterviewStatus, User

router = APIRouter()


@router.get(
    "/", dependencies=[Depends(get_current_hr_user)]
)
def get_scoreboard(*, session: SessionDep, filter: str | None = None) -> Any:
    """
    Get all candidates by filter.
    """
    filter_map = {}
    if filter:
        filter_map = {
            item[0]: item[1]
            for item in [item.split(':') for item in filter.split(';')]
        }
    query = select(
            Interview.applicant_id,
            User.is_active.label("status"),
            func.first(Interview.stack_tag).label("stack"),
            func.avg(
                case(
                    [
                        (Interview.mark == InterviewMark.A, 5),
                        (Interview.mark == InterviewMark.B, 4),
                        (Interview.mark == InterviewMark.C, 3),
                        (Interview.mark == InterviewMark.D, 2),
                        (Interview.mark == InterviewMark.E, 1)
                    ],
                    else_=None
                )
            ).label("mark")
        ).where(Interview.status == InterviewStatus.finished).subquery()
    if 'stack' in filter_map:
        query = query.where(query.c.stack == filter_map['stack'])
    if 'status' in filter_map:
        query = query.where(query.c.status == (filter_map['status'] == 'True'))
    if 'mark' in filter_map:
        marks_mapping = ['NO', 'E', 'D', 'C', 'B', 'A']
        query = query.where(query.c.mark == marks_mapping[int(filter_map['mark'])])
    query = query.group_by(User, User.id == Interview.applicant_id).order_by(Interview.event_datetime.desc())
    return [dict(item) for item in session.exec(query)]
