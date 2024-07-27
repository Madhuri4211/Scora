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
    student_id = Column(Integer, index=True)
    Q_id = Column(ARRAY(Integer))
    Student_answer = Column(ARRAY(String))
    correct_answer = Column(ARRAY(String))
    score = Column(Integer)
    correct_count = Column(Integer, nullable=False)
    incorrect_count = Column(Integer, nullable=False)

class DescriptiveResult(Base):
    __tablename__ = "descriptive_results"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, nullable=False, index=True)  # Index for faster lookups
    student_answer = Column(String, nullable=False)  # Adjust length if needed
    marks = Column(Integer, nullable=False)
    student_id = Column(Integer, nullable=False, index=True)  # Index for faster lookups