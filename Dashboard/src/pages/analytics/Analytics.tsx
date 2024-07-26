import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Color array for pie chart slices
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Define the data types
interface CorrectIncorrectData {
    question: string;
    correct: number;
    incorrect: number;
}

interface ScoreDistributionData {
    score: number;
    count: number;
}

const Analytics: React.FC = () => {
    const [correctIncorrectData, setCorrectIncorrectData] = useState<CorrectIncorrectData[]>([]);
    const [scoreDistributionData, setScoreDistributionData] = useState<ScoreDistributionData[]>([]);

    useEffect(() => {
        // Fetch correct/incorrect data
        axios.get('http://localhost:8000/api/analytics/correct-incorrect')
            .then(response => {
                const results = response.data.question_stats;

                const chartData = Object.keys(results).map(q_id => ({
                    question: `Question ${q_id}`,
                    correct: results[q_id].correct,
                    incorrect: results[q_id].incorrect,
                }));

                setCorrectIncorrectData(chartData);
            })
            .catch(error => {
                console.error('Error fetching correct/incorrect data:', error);
            });

        // Fetch score distribution data
        axios.get('http://localhost:8000/api/analytics/score-distribution')
            .then(response => {
                const results = response.data.score_distribution;

                const chartData = Object.keys(results).map(score => ({
                    score: parseInt(score),
                    count: results[score],
                }));

                setScoreDistributionData(chartData);
            })
            .catch(error => {
                console.error('Error fetching score distribution data:', error);
            });
    }, []);

    return (
        <div className="analytics">
            <h1>MCQ Test Analytics</h1>

            <h2>MCQ Test Results (Bar Chart)</h2>
            <BarChart width={600} height={300} data={correctIncorrectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="correct" fill="#8884d8" name="Correct Answers" />
                <Bar dataKey="incorrect" fill="#82ca9d" name="Incorrect Answers" />
            </BarChart>

            <h2>Score Distribution (Bar Chart)</h2>
            <BarChart width={600} height={300} data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default Analytics;
