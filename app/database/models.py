from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    JSON,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.connection import Base

from sqlalchemy import Boolean



class User(Base):

    __tablename__ = "users"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    username = Column(
        String,
        unique=True,
        index=True
    )


    email = Column(
        String,
        unique=True,
        index=True
    )


    hashed_password = Column(
        String
    )


    scans = relationship(
        "Scan",
        back_populates="owner"
    )

    github_access_token = Column(String, nullable=True)
    github_username = Column(String, nullable=True)
    github_connected = Column(Boolean, default=False)
    github_id = Column(String, nullable=True)
    github_avatar = Column(String, nullable=True)



class Scan(Base):

    __tablename__ = "scans"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    repository_id = Column(Integer, ForeignKey("repositories.id"))

    repository = relationship("Repository", back_populates="scans")


    query = Column(
        String
    )


    result = Column(
        JSON
    )


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    owner = relationship(
        "User",
        back_populates="scans"
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    vulnerabilities = relationship(
        "Vulnerability",
        back_populates="scan"
    )



class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    uri = Column(String)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    scans = relationship("Scan", back_populates="repository")

class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    file = Column(String)
    issue = Column(String)
    severity = Column(String)
    scan = relationship("Scan", back_populates="vulnerabilities")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    summary = Column(String)
    
