from sqlalchemy.orm import Session
import models, schemas
from uuid import uuid4
from passlib.context import CryptContext
import logging  # Import logging module

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()

def create_student(db: Session, student: schemas.StudentCreate):
    hashed_password = pwd_context.hash(student.password)
    db_student = models.Student(
        student_id=str(uuid4()), email=student.email, hashed_password=hashed_password
    )
    db.add(db_student)
    try:
        db.commit()
        db.refresh(db_student)
        return db_student
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
