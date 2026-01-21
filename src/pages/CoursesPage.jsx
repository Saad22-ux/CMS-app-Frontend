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
    const [filterProf, setFilterProf] = useState("");
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

    const findProfName = id =>
        professors.find(p => p.id === Number(id))?.name || "Unknown";

    // ================= ACTIONS =================
    const resetForm = () => {
        setCourse({ title: "", description: "", category: "", authorId: "" });
        setSelected(null);
    };

    const save = () => {
        if (!course.title || !course.authorId) return alert("Title and Professor are required!");

        const payload = { ...course, authorId: Number(course.authorId) };
        const action = selected
            ? updateCourse(selected.id, payload)
            : createCourse(payload);

        action.then(() => {
            resetForm();
            load();
        }).catch(err => alert("Operation failed"));
    };

    const remove = id => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            deleteCourse(id).then(() => {
                load();
                if (selected?.id === id) resetForm();
            });
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ================= UI =================
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ===== LEFT COLUMN: LIST & FILTERS (Span 7) ===== */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Header & Filters */}
                    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-20">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-2">
                                Course Catalog
                                <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                    {courses.length}
                                </span>
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                            >
                                <span className="text-lg">+</span> New Course
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow">
                                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                                <input
                                    placeholder="Search courses..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                    onKeyUp={search}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                                />
                            </div>
                            <select
                                value={filterProf}
                                onChange={(e) => filter(e.target.value)}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                            >
                                <option value="">👨‍🏫 All Professors</option>
                                {professors.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Course List Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {courses.map(c => (
                            <div
                                key={c.id}
                                onClick={() => edit(c)}
                                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col ${
                                    selected?.id === c.id
                                        ? "bg-white border-indigo-500 shadow-xl shadow-indigo-100 ring-1 ring-indigo-500 transform scale-[1.02]"
                                        : "bg-white border-slate-100 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        {c.category || "General"}
                                    </span>
                                    {selected?.id === c.id && (
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {c.title}
                                </h3>

                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                                    {c.description || "No description provided."}
                                </p>

                                <div className="flex items-center gap-2 pt-3 border-t border-slate-50 mt-auto">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 flex items-center justify-center text-xs shadow-sm">
                                        🎓
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500">
                                        {findProfName(c.authorId)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {courses.length === 0 && (
                            <div className="col-span-full py-16 text-center">
                                <div className="text-4xl mb-3">📭</div>
                                <p className="text-slate-400 font-medium">No courses found matching criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== RIGHT COLUMN: FORM (Span 5) ===== */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {selected ? "Edit Course" : "Create Course"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">
                                    {selected ? "Update details below" : "Add a new entry"}
                                </p>
                            </div>
                            {selected && (
                                <button
                                    onClick={resetForm}
                                    className="text-xs font-medium text-slate-400 hover:text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Title</label>
                                <input
                                    placeholder="e.g. Advanced System Design"
                                    value={course.title}
                                    onChange={e => setCourse({ ...course, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Professor</label>
                                    <select
                                        value={course.authorId}
                                        onChange={e => setCourse({ ...course, authorId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                    >
                                        <option value="">Select...</option>
                                        {professors.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Category</label>
                                    <input
                                        placeholder="e.g. DevOps"
                                        value={course.category}
                                        onChange={e => setCourse({ ...course, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Description</label>
                                <textarea
                                    placeholder="What is this course about?"
                                    rows="5"
                                    value={course.description}
                                    onChange={e => setCourse({ ...course, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={save}
                                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-95 ${
                                        selected
                                            ? "bg-indigo-600 hover:bg-indigo-700"
                                            : "bg-slate-900 hover:bg-slate-800"
                                    }`}
                                >
                                    {selected ? "Save Changes" : "Create Course"}
                                </button>

                                {selected && (
                                    <button
                                        onClick={() => remove(selected.id)}
                                        className="py-3.5 px-4 rounded-xl font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}