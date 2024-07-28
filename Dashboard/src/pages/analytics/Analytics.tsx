import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './analytics.scss';

const Analytics: React.FC = () => {
    const [lastResult, setLastResult] = useState<any>(null);
    const [studentResults, setStudentResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchLastResult = async () => {
            try {
                const response = await axios.get('http://localhost:8000/mcq/last_result/');
                setLastResult(response.data);
            } catch (error) {
                console.error('Error fetching the last MCQ result:', error);
            }
        };

        fetchLastResult();
    }, []);

    useEffect(() => {
        if (lastResult) {
            const fetchStudentResults = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/mcq/results/${lastResult.student_id}`);
                    setStudentResults(response.data);
                } catch (error) {
                    console.error('Error fetching MCQ results for the student:', error);
                }
            };

            fetchStudentResults();
        }
    }, [lastResult]);

    if (!lastResult) {
        return <div>Loading...</div>;
    }

    const chartData = [
        { name: 'Correct Answers', value: lastResult.correct_count },
        { name: 'Incorrect Answers', value: lastResult.incorrect_count },
    ];

    const performanceData = studentResults.map((result, index) => ({
        attempt: index + 1,
        correct: result.correct_count,
        incorrect: result.incorrect_count,
        score: result.score
    }));

    const COLORS = ['#0088FE', '#FF8042'];

    return (
        <div className="analytics-container">
            <h2>MCQ Result Analytics</h2>
            <div className="charts">
                <div className="chart">
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </div>
                <div className="chart">
                    <PieChart width={700} height={300}>
                        <Pie
                            data={chartData}
                            cx={250}
                            cy={150}
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>
            <h2>Performance Over Time</h2>
            <div className="chart">
                <LineChart
                    width={700}
                    height={300}
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="attempt" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="correct" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="incorrect" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="score" stroke="#ff7300" />
                </LineChart>
            </div>
        </div>
    );
};

export default Analytics;
