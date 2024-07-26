import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './analytics.scss';

const Analytics: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/mcq/last_result/');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching the last MCQ result:', error);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    const chartData = [
        { name: 'Correct Answers', value: data.correct_count },
        { name: 'Incorrect Answers', value: data.incorrect_count },
    ];

    const lineChartData = [
        { name: 'Latest Attempt', correct: data.correct_count, incorrect: data.incorrect_count },
    ];

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
                    <PieChart width={500} height={300}>
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
                <div className="chart">
                    <LineChart
                        width={500}
                        height={300}
                        data={lineChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="correct" stroke="#8884d8" />
                        <Line type="monotone" dataKey="incorrect" stroke="#FF8042" />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
