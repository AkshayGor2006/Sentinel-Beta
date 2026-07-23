from fastapi import FastAPI
from sqlalchemy import inspect, text

from app.api.repo import router
from app.api.auth import router as auth_router

from app.database.connection import engine
from app.database.models import Base
from app.api import dashboard
from app.api import github_auth
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Sentinel AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(
    bind=engine
)


def ensure_github_user_columns():
    inspector = inspect(engine)
    user_columns = {
        column["name"]
        for column in inspector.get_columns("users")
    }

    required_columns = {
        "github_access_token": "VARCHAR",
        "github_username": "VARCHAR",
        "github_connected": "BOOLEAN DEFAULT 0",
        "github_id": "VARCHAR",
        "github_avatar": "VARCHAR",
    }

    with engine.begin() as connection:
        for column_name, column_type in required_columns.items():
            if column_name not in user_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE users ADD COLUMN {column_name} {column_type}"
                    )
                )

        connection.execute(
            text(
                "UPDATE users "
                "SET github_connected = 1 "
                "WHERE github_username IS NOT NULL "
                "AND github_access_token IS NOT NULL"
            )
        )


ensure_github_user_columns()


app.include_router(auth_router)

# ADD THIS LINE 🔥
app.include_router(router)

app.include_router(
    dashboard.router
)

app.include_router(
    github_auth.router
)
