import { useEffect, useState } from "react";
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    searchCourses,
    filterCourses
} from "../api/courseApi";

export default function CoursesPage() {

    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [selected, setSelected] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [filterProf, setFilterProf] = useState(""); // pour filtrer la liste
    const [course, setCourse] = useState({
        title: "",
        description: "",
        category: "",
        authorId: ""
    });

    // ================= LOAD DATA =================
    const load = () => getCourses().then(r => setCourses(r.data));

    useEffect(() => {
        load();
        fetch("http://localhost:8080/professors")
            .then(r => r.json())
            .then(setProfessors);
    }, []);

    // Chercher le nom du professeur
    const findProfName = id =>
        professors.find(p => p.id === Number(id))?.name || "Unknown";

    // ================= ACTIONS =================
    const save = () => {
        if (!course.title || !course.authorId) return alert("Missing fields");

        // S'assurer que authorId est bien un nombre
        const payload = { ...course, authorId: Number(course.authorId) };

        const action = selected
            ? updateCourse(selected.id, payload)
            : createCourse(payload);

        action.then(() => {
            setCourse({ title: "", description: "", category: "", authorId: "" });
            setSelected(null);
            load();
        });
    };

    const remove = id => {
        if (window.confirm("Delete?")) {
            deleteCourse(id).then(load);
            setSelected(null);
        }
    };

    const search = () => {
        if (!keyword) return load();
        searchCourses(keyword).then(r => setCourses(r.data));
    };

    const filter = id => {
        setFilterProf(id);
        if (!id) return load();
        filterCourses(id).then(r => setCourses(r.data));
    };

    const edit = c => {
        setSelected(c);
        setCourse(c);
    };

    // ================= UI =================
    return (
        <div className="p-10 grid grid-cols-3 gap-6">

            {/* LIST COURSES */}
            <div>
                <h2 className="text-xl font-bold mb-3">Courses</h2>

                {/* Search */}
                <input
                    placeholder="Search..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onKeyUp={search}
                    className="border w-full mb-2 p-2"
                />

                {/* Filter by professor */}
                <select
                    value={filterProf}
                    onChange={(e) => filter(e.target.value)}
                    className="border w-full mb-4 p-2"
                >
                    <option value="">All Professors</option>
                    {professors.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                {/* Courses List */}
                {courses.map(c => (
                    <div
                        key={c.id}
                        className="bg-white p-3 mb-2 rounded shadow cursor-pointer"
                        onClick={() => edit(c)}
                    >
                        <strong>{c.title}</strong>
                        <p className="text-sm">👨‍🏫 {findProfName(c.authorId)}</p>
                    </div>
                ))}
            </div>

            {/* FORM */}
            <div className="col-span-2 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">
                    {selected ? "Edit Course" : "New Course"}
                </h2>

                <input
                    placeholder="Title"
                    value={course.title}
                    onChange={e => setCourse({ ...course, title: e.target.value })}
                    className="border w-full p-2 mb-2"
                />

                <select
                    value={course.authorId}
                    onChange={e => setCourse({ ...course, authorId: e.target.value })}
                    className="border w-full p-2 mb-2"
                >
                    <option value="">Select Professor</option>
                    {professors.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                <input
                    placeholder="Category"
                    value={course.category}
                    onChange={e => setCourse({ ...course, category: e.target.value })}
                    className="border w-full p-2 mb-2"
                />

                <textarea
                    placeholder="Description"
                    value={course.description}
                    onChange={e => setCourse({ ...course, description: e.target.value })}
                    className="border w-full p-2 mb-3"
                />

                <button
                    onClick={save}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {selected ? "Update" : "Create"}
                </button>

                {selected && (
                    <button
                        onClick={() => remove(selected.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded ml-3"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
