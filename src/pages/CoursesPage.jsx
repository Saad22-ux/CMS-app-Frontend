import { useEffect, useState } from "react";
import { getCourses, createCourse, deleteCourse } from "../api/courseApi";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const load = () => {
        getCourses().then(res => setCourses(res.data));
    };

    useEffect(load, []);

    // Add new course
    const addCourse = () => {
        if (!title || !author) return alert("Title and Author are required");

        createCourse({
            title,
            author,
            description,
            category
        }).then(() => {
            setTitle(""); setAuthor(""); setDescription(""); setCategory("");
            load();
        });
    };

    // Delete course
    const removeCourse = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            deleteCourse(id).then(load);
            setSelectedCourse(null);
        }
    };

    return (
        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ===== Courses List ===== */}
            <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-4">Courses</h2>

                <ul className="space-y-2">
                    {courses.map(c => (
                        <li
                            key={c.id}
                            onClick={() => setSelectedCourse(c)}
                            className={`p-3 rounded cursor-pointer border ${
                                selectedCourse?.id === c.id ? "bg-blue-100 border-blue-400" : "bg-white"
                            }`}
                        >
                            <h3 className="font-semibold">{c.title}</h3>
                            <p className="text-gray-500 text-sm">{c.author}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ===== Course Details ===== */}
            <div className="md:col-span-2">
                {selectedCourse ? (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-2">{selectedCourse.title}</h2>
                        <p className="text-gray-600 mb-2"><strong>Author:</strong> {selectedCourse.author}</p>
                        <p className="text-gray-600 mb-2"><strong>Category:</strong> {selectedCourse.category || "General"}</p>
                        <p className="text-gray-700 mb-4">{selectedCourse.description}</p>

                        <button
                            onClick={() => removeCourse(selectedCourse.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete Course
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-2">Select a course to see details</h2>
                    </div>
                )}

                {/* ===== Add Course Form ===== */}
                <div className="bg-white p-6 rounded shadow mt-6">
                    <h2 className="text-xl font-bold mb-4">Add New Course</h2>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="border w-full px-3 py-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Author"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            className="border w-full px-3 py-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="border w-full px-3 py-2 rounded"
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="border w-full px-3 py-2 rounded h-24"
                        />
                        <button
                            onClick={addCourse}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
