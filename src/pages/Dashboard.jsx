import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import { getUsers } from "../api/userApi";
import { getProfessors } from "../api/professorApi";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [professor, setProfessor] = useState(null);

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
        getUsers().then(res => setUsers(res.data));
        getProfessors().then(res => setProfessor(res.data));
    }, []);

    // Users per course
    const usersPerCourse = courses.map(course => ({
        title: course.title,
        usersCount: users.filter(u => u.courseIds.includes(course.id)).length
    }));

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

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-10 space-y-10">
            {/* Top cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold">Courses</h3>
                    <p className="text-3xl mt-2">{courses.length}</p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold">Users</h3>
                    <p className="text-3xl mt-2">{users.length}</p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold">Professors</h3>
                    <p className="text-3xl mt-2">{professor ? 1 : 0}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar chart: Users per course */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Users per Course</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={usersPerCourse}>
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="usersCount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart: Courses by category */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Courses by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={coursesByCategory}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#82ca9d"
                                label
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
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Recent Courses</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr>
                        <th className="border-b p-2">Title</th>
                        <th className="border-b p-2">Author</th>
                        <th className="border-b p-2">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.slice(-5).map(c => (
                        <tr key={c.id}>
                            <td className="border-b p-2">{c.title}</td>
                            <td className="border-b p-2">{c.author}</td>
                            <td className="border-b p-2">{c.category || "General"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
