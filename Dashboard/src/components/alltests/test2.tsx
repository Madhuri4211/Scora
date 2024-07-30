import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './test2.scss';

interface AnswersState {
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answer5: string;
}

const questions = [
  "Describe binary search algorithm",
  "Explain time complexity in algorithms",
  "Discuss the importance of data structures",
  "Describe the steps of Quick Sort algorithm",
  "Explain the use of stacks in programming"
];

const DescriptiveQuestions: React.FC = () => {
  const [answers, setAnswers] = useState<AnswersState>({
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    answer5: '',
  });
  const [evaluationResults, setEvaluationResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const studentId = localStorage.getItem('student_id'); // Retrieve student_id from localStorage

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnswers(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      console.error('Student ID is not available.');
      return;
    }

    const data = [
      { question_id: 1, question: questions[0], Student_answer: answers.answer1, marks: 0, student_id: studentId },
      { question_id: 2, question: questions[1], Student_answer: answers.answer2, marks: 0, student_id: studentId },
      { question_id: 3, question: questions[2], Student_answer: answers.answer3, marks: 0, student_id: studentId },
      { question_id: 4, question: questions[3], Student_answer: answers.answer4, marks: 0, student_id: studentId },
      { question_id: 5, question: questions[4], Student_answer: answers.answer5, marks: 0, student_id: studentId }
    ];

    try {
      const response = await axios.post('http://localhost:8000/descriptive/', data);
      setEvaluationResults(response.data.results);
      navigate('/'); // Redirect to the home page after submission
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="quiz-heading">Descriptive Questions</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="question-container">
            <label htmlFor={`answer${index + 1}`} className="question-text">
              {`Question ${index + 1}: ${question}`}
            </label>
            <textarea
              id={`answer${index + 1}`}
              name={`answer${index + 1}`}
              value={answers[`answer${index + 1}` as keyof AnswersState]}
              onChange={handleChange}
              className="answer-textarea"
              rows={4}
            />
          </div>
        ))}
        <button type="submit" className="submit-button">Submit Answers</button>
      </form>

      {evaluationResults.length > 0 && (
        <div className="results-container">
          <h2>Evaluation Results</h2>
          <ul>
            {evaluationResults.map((result, index) => (
              <li key={index}>
                Question {result.question_id}: {result.score} marks
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DescriptiveQuestions;
