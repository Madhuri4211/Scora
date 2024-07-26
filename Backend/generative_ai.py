import google.generativeai as genai
from sqlalchemy.orm import Session
import models
from typing import List, Tuple, Dict, Any
import schemas
from models import MCQResult

# Configure the Google Generative AI API key
GOOGLE_API_KEY = "AIzaSyCyq0jbEgSC9C-TykrFFVUK5_wQVhpjnS8"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def EvaluateDescriptive(data: List[schemas.DescriptiveData], db: Session):
    Marks = 0
    Responses = {"Q_id": [], "score": []}
    for item in data:
        question = item.question
        answer = item.Student_answer
        marks = str(item.marks)
        response = model.generate_content(f"question: {question} student answer: {answer} evaluate this answer for the above question with student answer and give me marks out of {marks} in numerical format. give me only marks. don't give anything except marks")
        Responses["Q_id"].append(item.question_id)
        Responses["score"].append(response.text)
        Marks += int(response.text)

        db_descriptive_result = models.DescriptiveResult(
            question_id=item.question_id,
            student_answer=item.Student_answer,
            marks=int(response.text),
            student_id=item.student_id
        )
        db.add(db_descriptive_result)
        db.commit()
        db.refresh(db_descriptive_result)

    return Marks, Responses

def get_job_recommendations(courses):
    response = model.generate_content(f"Provide 5 job recommendations for the following courses: {', '.join(courses)}")
    recommendations = list(response.text.split('\n'))
    return recommendations

def get_course_recommendations(courses):
    response = model.generate_content(f"Provide 5 relevant course recommendations for the following courses: {', '.join(courses)}")
    recommendations = list(response.text.split('\n'))
    return recommendations
