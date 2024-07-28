from sqlalchemy.orm import Session
from sqlalchemy import text
import schemas
from passlib.context import CryptContext
import logging

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_student_by_email(db: Session, email: str):
    return db.execute(text("SELECT * FROM student WHERE email = :email"), {"email": email}).fetchone()

def create_student(db: Session, student: schemas.StudentCreate):
    hashed_password = pwd_context.hash(student.password)
    try:
        db.execute(text("""
            INSERT INTO student (email, hashed_password) 
            VALUES (:email, :hashed_password)
        """), {
            "email": student.email,
            "hashed_password": hashed_password
        })
        db.commit()
        return get_student_by_email(db, student.email)
    except Exception as e:
        db.rollback()
        logging.error(f"Failed to create student: {e}")
        raise

def authenticate_student(db: Session, email: str, password: str):
    student = get_student_by_email(db, email)
    if not student:
        return False
    if not pwd_context.verify(password, student.hashed_password):
        return False
    return student
