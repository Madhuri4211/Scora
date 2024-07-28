from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn
import schemas, crud

DATABASE_URL = "postgresql://postgres:system@localhost/Scora"

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust as per your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    # Log the response headers
    print("Response headers:", response.headers)
    return response

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

        db.execute(text("""
            INSERT INTO mcq_results (student_id, Q_id, Student_answer, correct_answer, score, correct_count, incorrect_count) 
            VALUES (:student_id, :Q_id, :Student_answer, :correct_answer, :score, :correct_count, :incorrect_count)
        """), {
            "student_id": submission.student_id,
            "Q_id": submission.Q_id,
            "Student_answer": submission.Student_answer,
            "correct_answer": submission.correct_answer,
            "score": score,
            "correct_count": correct_count,
            "incorrect_count": incorrect_count
        })
        db.commit()
        result = db.execute(text("SELECT id FROM mcq_results ORDER BY id DESC LIMIT 1")).fetchone()
        return {"result_id": result.id, "score": score, "correct_count": correct_count, "incorrect_count": incorrect_count}
    except Exception as e:
        logging.error(f"Error processing MCQ submission: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    
@app.get("/mcq/last_result/")
async def get_last_result(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT * FROM mcq_results ORDER BY id DESC LIMIT 1")).fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="No results found")
        return result
    except Exception as e:
        logging.error(f"Internal Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/mcq/results/{student_id}")
async def get_mcq_results_by_student(student_id: int, db: Session = Depends(get_db)):
    try:
        results = db.execute(text("SELECT * FROM mcq_results WHERE student_id = :student_id ORDER BY id"), {"student_id": student_id}).fetchall()
        if not results:
            raise HTTPException(status_code=404, detail="No results found for the given student_id")
        return results
    except Exception as e:
        logging.error(f"Error fetching MCQ results for student_id {student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching the data.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
