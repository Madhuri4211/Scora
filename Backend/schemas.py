from pydantic import BaseModel, EmailStr
from typing import List

class StudentCreate(BaseModel):
    email: EmailStr
    password: str

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class Student(BaseModel):
    student_id: int
    email: EmailStr

    class Config:
        orm_mode = True

class MCQSubmission(BaseModel):
    Q_id: list[int]
    Student_answer: list[str]
    correct_answer: list[str]
    student_id: int

    class Config:
        orm_mode = True

class MCQResult(BaseModel):
    id: int
    student_id: int
    Q_id: List[int]
    Student_answer: List[str]
    correct_answer: List[str]
    score: int
    correct_count: int
    incorrect_count: int

    class Config:
        orm_mode = True