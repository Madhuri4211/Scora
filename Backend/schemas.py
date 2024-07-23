from pydantic import BaseModel, EmailStr

class StudentCreate(BaseModel):
    email: EmailStr
    password: str

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class Student(BaseModel):
    student_id: str
    email: EmailStr

    class Config:
        orm_mode = True
