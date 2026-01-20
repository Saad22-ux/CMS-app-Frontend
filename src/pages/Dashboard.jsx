import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import { getUsers } from "../api/userApi";
import { getProfessors } from "../api/professorApi";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [professors, setProfessors] = useState([]);

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
        getUsers().then(res => setUsers(res.data));
        getProfessors().then(res => setProfessors(res.data));
    }, []);

    // Users per course
    const usersPerCourse = courses.map(course => ({
        title: course.title,
        usersCount: users.filter(u => u.courseIds.includes(course.id)).length
    }));

    // Find professor name
    const findProfessorName = (id) =>
        professors.find(p => p.id === Number(id))?.name || "Unknown";

    // Courses by category
    const coursesByCategory = [];
    const categoryMap = {};
    courses.forEach(c => {
        if (!c.category) c.category = "General";
        categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });
    for (const cat in categoryMap) {
        coursesByCategory.push({ name: cat, value: categoryMap[cat] });
    }

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#FF6F61"];

    return (
        <div className="p-10 space-y-10">

            {/* Top cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-600">Courses</h3>
                    <p className="text-4xl font-bold mt-2 text-gray-800">{courses.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-600">Users</h3>
                    <p className="text-4xl font-bold mt-2 text-gray-800">{users.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-600">Professors</h3>
                    <p className="text-4xl font-bold mt-2 text-gray-800">{professors.length}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Users per Course */}
                <div className="bg-white p-8 rounded-2xl shadow-md flex-1">
                    <h3 className="text-lg font-semibold mb-6 text-gray-700">Users per Course</h3>
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart data={usersPerCourse} margin={{ top: 20, bottom: 50, left: 20, right: 20 }}>
                            <XAxis dataKey="title" tick={{ fontSize: 14 }} interval={0} angle={-20} textAnchor="end" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="usersCount" fill="#8884d8" radius={[5,5,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Courses by Category */}
                <div className="bg-white p-8 rounded-2xl shadow-md flex-1">
                    <h3 className="text-lg font-semibold mb-6 text-gray-700">Courses by Category</h3>
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={coursesByCategory}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={180}
                                fill="#82ca9d"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {coursesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>


            {/* Recent Courses Table */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Courses</h3>
                <table className="min-w-full text-left border-collapse">
                    <thead>
                    <tr>
                        <th className="border-b-2 p-3 text-gray-500">Title</th>
                        <th className="border-b-2 p-3 text-gray-500">Author</th>
                        <th className="border-b-2 p-3 text-gray-500">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.slice(-5).map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            <td className="border-b p-3 text-gray-700 font-medium">{c.title}</td>
                            <td className="border-b p-3 text-gray-700">{findProfessorName(c.authorId)}</td>
                            <td className="border-b p-3 text-gray-700">{c.category || "General"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
