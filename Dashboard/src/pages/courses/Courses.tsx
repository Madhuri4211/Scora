import "./courses.scss";
import { useState, ChangeEvent, FormEvent } from "react";
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";

// Fetch your API_KEY
const API_KEY = "AIzaSyCyq0jbEgSC9C-TykrFFVUK5_wQVhpjnS8";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Define types for function parameters and return values
async function generateContent(prompt: string): Promise<string> {
  try {
    const response: GenerateContentResult = await model.generateContent(prompt);
    console.log("API Response:", response); // Log the response structure

    // Handle the response correctly based on the logged structure
    if (response.response && response.response.text()) {
      return response.response.text().trim();
    } else {
      console.error("Error generating content: Response or response.text is undefined.");
      return ""; // Return an empty string or handle the error as needed
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return ""; // Return an empty string or handle the error as needed
  }
}

async function getJobRecommendations(courses: string[]): Promise<string[]> {
  const response = await generateContent(`Provide 5 job recommendations for the following courses: ${courses.join(', ')}. dont give anything in bold font.`);
  if (response) {
    const recommendations = response.split('\n');
    return recommendations.filter(recommendation => recommendation.trim() !== "");
  }
  return [];
}

async function getCourseRecommendations(courses: string[]): Promise<string[]> {
  const response = await generateContent(`Provide 5 relevant course recommendations for the following courses: ${courses.join(', ')}. dont give anything in bold font.`);
  if (response) {
    const recommendations = response.split('\n');
    return recommendations.filter(recommendation => recommendation.trim() !== "");
  }
  return [];
}

const Courses = () => {
  const [inputCourses, setInputCourses] = useState<string>("");
  const [suggestedCourses, setSuggestedCourses] = useState<string[]>([]);
  const [suggestedJobs, setSuggestedJobs] = useState<string[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputCourses(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const coursesArray = inputCourses.split(',').map(course => course.trim());
    const coursesRecommendations = await getCourseRecommendations(coursesArray);
    const jobRecommendations = await getJobRecommendations(coursesArray);
    setSuggestedCourses(coursesRecommendations);
    setSuggestedJobs(jobRecommendations);
  };

  return (
    <div className="Courses" style={{ overflow: "hidden" }}>
      <div className="info">
        
        
        <form onSubmit={handleSubmit}>
          
          <input
            type="text"
            value={inputCourses}
            onChange={handleInputChange}
            placeholder="Enter skills or courses, separated by commas"
          />
          
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="recommendations">
        <div className="suggested-courses box">
          <h2>Suggested Courses</h2>
          <ul>
            {suggestedCourses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>
        <div className="suggested-jobs box">
          <h2>Suggested Jobs</h2>
          <ul>
            {suggestedJobs.map((job, index) => (
              <li key={index}>{job}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Courses;
