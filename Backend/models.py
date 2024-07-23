from sqlalchemy import Column, String
from database import Base

class Student(Base):
    __tablename__ = "student"

    student_id = Column(String, primary_key=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
