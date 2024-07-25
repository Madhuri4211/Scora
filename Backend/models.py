from sqlalchemy import Column, Integer, String
from database import Base

class Student(Base):
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
