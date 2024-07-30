import google.generativeai as genai
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import schemas

GOOGLE_API_KEY = "AIzaSyDjApCt7r09A0jH82clzVcyuGkEkuF-kno"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def evaluate_answer_with_ai(question: str, answer: str, marks_possible: int) -> int:
    try:
        prompt = (
            f"Question: {question}\n"
            f"Student Answer: {answer}\n"
            f"Evaluate the answer and give marks out of {marks_possible} in numerical format. "
            f"Provide only the marks."
        )
        
        response = model.generate_content(prompt)
        print("API Response:", response.text)  # Debugging line
        score = int(response.text.strip())
        return score

    except Exception as e:
        print(f"Error evaluating answer with AI: {e}")
        return 0

def get_job_recommendations(courses):
    response = model.generate_content(f"Provide 5 job recommendations for the following courses: {', '.join(courses)}")
    recommendations = list(response.text.split('\n'))
    return recommendations

def get_course_recommendations(courses):
    response = model.generate_content(f"Provide 5 relevant course recommendations for the following courses: {', '.join(courses)}")
    recommendations = list(response.text.split('\n'))
    return recommendations
