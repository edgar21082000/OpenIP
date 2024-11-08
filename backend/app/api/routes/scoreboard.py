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
    "/"
)
def get_scoreboard(*, session: SessionDep) -> Any:
    """
    Get all candidates by filter.
    """
    query = select(
            User.email,
            User.is_active.label("status"),
            Interview.stack_tag.label('stack'),
            func.avg(
                case(
                    (Interview.mark == InterviewMark.A, 5),
                    (Interview.mark == InterviewMark.B, 4),
                    (Interview.mark == InterviewMark.C, 3),
                    (Interview.mark == InterviewMark.D, 2),
                    (Interview.mark == InterviewMark.E, 1),
                    else_=None
                )
            ).label("mark")
        ).where(Interview.status == InterviewStatus.finished)

    query = query.join(User, User.id == Interview.applicant_id) \
                 .group_by(User.email, User.is_active, Interview.stack_tag)

    data = session.exec(query).all()

    return [{'mail': item[0], 'status': item[1], 'stack': item[2], 'mark': int(item[3])} for item in data]
