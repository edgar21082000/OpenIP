from fastapi import APIRouter

from app.api.routes import interviewer, login, scoreboard, users, utils

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(interviewer.router, prefix='/interviewer', tags=['interviewer'])
api_router.include_router(scoreboard.router, prefix='/scoreboard', tags=['scoreboard'])
