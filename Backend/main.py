from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust as per your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/signup/", response_model=schemas.Student)
def signup(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = crud.get_student_by_email(db, email=student.email)
    if db_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_student(db=db, student=student)

@app.post("/login/")
def login(student: schemas.StudentLogin, db: Session = Depends(get_db)):
    db_student = crud.authenticate_student(db, email=student.email, password=student.password)
    if not db_student:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful", "student": db_student}

@app.post("/mcq/")
async def submit_mcq(submission: schemas.MCQSubmission, db: Session = Depends(get_db)):
    score = sum([1 for i, answer in enumerate(submission.Student_answer) if answer == submission.correct_answer[i]])
    
    mcq_result = models.MCQResult(
        student_id=submission.student_id,
        Q_id=submission.Q_id,
        Student_answer=submission.Student_answer,
        correct_answer=submission.correct_answer,
        score=score,
    )
    
    db.add(mcq_result)
    db.commit()
    db.refresh(mcq_result)
    
    return {"result_id": mcq_result.id, "score": score}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)