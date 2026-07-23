from app.database.models import User
from app.core.security import create_access_token

from passlib.context import CryptContext


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_user(
    db,
    user
):

    new_user = User(

        username=user.username,

        email=user.email,

        hashed_password=
        hash_password(
            user.password
        )

    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    return new_user



def authenticate_user(db, username, password):

    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        return False

    if not verify_password(password, user.hashed_password):
        return False

    token = create_access_token(
    {
        "sub": user.username
    }
    )

    return token