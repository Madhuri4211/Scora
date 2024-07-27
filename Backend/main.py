from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud,generative_ai
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn
from typing import List

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
    return {
        "message": "Login successful",
        "student": {
            "student_id": db_student.student_id,
            "email": db_student.email
        }
    }

@app.post("/mcq/")
async def submit_mcq(submission: schemas.MCQSubmission, db: Session = Depends(get_db)):
    try:
        logging.debug(f"Received submission: {submission}")
        correct_count = sum([1 for i, answer in enumerate(submission.Student_answer) if answer == submission.correct_answer[i]])
        incorrect_count = len(submission.Student_answer) - correct_count
        score = correct_count

        mcq_result = models.MCQResult(
            student_id=submission.student_id,
            Q_id=submission.Q_id,
            Student_answer=submission.Student_answer,
            correct_answer=submission.correct_answer,
            score=score,
            correct_count=correct_count,
            incorrect_count=incorrect_count
        )

        db.add(mcq_result)
        db.commit()
        db.refresh(mcq_result)

        return {"result_id": mcq_result.id, "score": score, "correct_count": correct_count, "incorrect_count": incorrect_count}
    except Exception as e:
        logging.error(f"Error processing MCQ submission: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    
@app.get("/mcq/last_result/", response_model=schemas.MCQResult)
def get_last_mcq_result(db: Session = Depends(get_db)):
    last_result = db.query(models.MCQResult).order_by(models.MCQResult.id.desc()).first()
    if not last_result:
        raise HTTPException(status_code=404, detail="No results found")
    return last_result

@app.get("/mcq/results/{student_id}")
async def get_mcq_results_by_student(student_id: int, db: Session = Depends(get_db)):
    try:
        results = db.query(models.MCQResult).filter(models.MCQResult.student_id == student_id).order_by(models.MCQResult.id).all()
        if not results:
            raise HTTPException(status_code=404, detail="No results found for the given student_id")
        return results
    except Exception as e:
        logging.error(f"Error fetching MCQ results for student_id {student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching the data.")
    
@app.post("/descriptive/")
def create_descriptive(data: List[schemas.DescriptiveData], db: Session = Depends(get_db)):
    try:
        # Log the received data
        for item in data:
            print(f"Received answer (length {len(item.Student_answer)}): {item.Student_answer[:100]}...")  # Log part of the answer

        # Evaluate descriptive answers
        marks, responses = generative_ai.evaluate_descriptive(data, db)
        
        # Optionally, log the marks and responses for debugging
        print(f"Marks: {marks}")
        print(f"Responses: {responses}")

        return {"message": "Descriptive answers submitted successfully", "results": responses}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
