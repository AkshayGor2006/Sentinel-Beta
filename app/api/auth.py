from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user_schema import UserCreate

from app.database.connection import SessionLocal

from app.database.models import User

from app.services.auth_service import hash_password
from app.database.connection import get_db

from app.schemas.user_schema import (
    UserCreate,
    UserLogin
)


from app.services.auth_service import (
    create_user,
    authenticate_user
)



router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



@router.post("/signup")
def signup(
    user: UserCreate
):


    db = SessionLocal()

    try:

        existing_user = db.query(User).filter(
            (User.email == user.email) | (User.username == user.username)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User already exists"
            )

        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password)
        )


        db.add(new_user)

        db.commit()

        db.refresh(new_user)

        return {

            "message":"User created",

            "user_id":new_user.id

        }

    finally:
        db.close()

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    token = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )


    if not token:

        return {
            "error":"Invalid credentials"
        }


    return {

        "access_token": token,

        "token_type": "bearer"

    }
