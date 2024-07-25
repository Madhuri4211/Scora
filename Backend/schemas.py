from pydantic import BaseModel, EmailStr

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