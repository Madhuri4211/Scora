import google.generativeai as genai
from sqlalchemy.orm import Session
from typing import List, Tuple, Dict, Any
import schemas

# Configure the Google Generative AI API key
GOOGLE_API_KEY = "AIzaSyDjApCt7r09A0jH82clzVcyuGkEkuF-kno"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def evaluate_descriptive(data: List[schemas.DescriptiveData], db: Session):
    marks = 0
    responses = {"Q_id": [], "score": []}
    
    for item in data:
        response = model.generate_content(
            f"Question: {item.question}\nStudent Answer: {item.Student_answer}\n"
            f"Evaluate the answer and give marks out of {item.marks} in numerical format. Provide only the marks."
        )
        
        try:
            score = int(response.text.strip())
        except ValueError:
            score = 0  # Default to 0 if parsing fails

        responses["Q_id"].append(item.question_id)
        responses["score"].append(score)
        marks += score

        db_descriptive_result = DescriptiveResult(
            question_id=item.question_id,
            student_answer=item.Student_answer,
            marks=score,
            student_id=item.student_id
        )
        db.add(db_descriptive_result)
        db.commit()
        db.refresh(db_descriptive_result)

    return marks, responses
def get_job_recommendations(courses):
    response = model.generate_content(f"Provide 5 job recommendations for the following courses: {', '.join(courses)}")
    recommendations = list(response.text.split('\n'))
    return recommendations

def get_course_recommendations(courses):
    response = model.generate_content(f"Provide 5 relevant course recommendations for the following courses: {', '.join(courses)}")
    recommendations = list(response.text.split('\n'))
    return recommendations
