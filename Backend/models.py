from sqlalchemy import Column, Integer,  ARRAY,String
from database import Base

class Student(Base):
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class MCQResult(Base):
    __tablename__ = "mcq_results"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer)
    Q_id = Column(ARRAY(Integer))
    Student_answer = Column(ARRAY(String))
    correct_answer = Column(ARRAY(String))
    score = Column(Integer)