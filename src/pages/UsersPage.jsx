import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { getCourses } from "../api/courseApi";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [courseIds, setCourseIds] = useState([]);

    const load = () => {
        getUsers().then(res => setUsers(res.data));
        getCourses().then(res => setCourses(res.data));
    };

    useEffect(load, []);

    const resetForm = () => {
        setSelectedUser(null);
        setName("");
        setEmail("");
        setRole("student");
        setCourseIds([]);
    };

    // Add new user
    const addUser = () => {
        if (!name || !email) return alert("Name and Email are required");

        const validCourseIds = Array.isArray(courseIds) ? courseIds.map(Number) : [];

        createUser({ name: name.trim(), email: email.trim(), role, courseIds: validCourseIds })
            .then(() => {
                resetForm();
                load();
            })
            .catch(err => {
                console.error("Create failed:", err.response || err);
                alert("Create failed");
            });
    };

    // Delete user
    const removeUser = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        deleteUser(id)
            .then(load)
            .catch(err => console.error(err));

        resetForm();
    };

    // Select/deselect course
    const toggleCourse = (id) => {
        if (courseIds.includes(id)) {
            setCourseIds(courseIds.filter(cid => cid !== id));
        } else {
            setCourseIds([...courseIds, id]);
        }
    };

    // When editing a user
    const editUser = (u) => {
        setSelectedUser(u);
        setName(u.name);
        setEmail(u.email);
        setRole(u.role);
        setCourseIds(u.courseIds || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Save updates for a selected user
    const saveUser = () => {
        if (!selectedUser) return;

        const payload = {
            name: name.trim(),
            email: email.trim(),
            role: role || "student",
            courseIds: Array.isArray(courseIds) ? courseIds.map(Number) : []
        };

        updateUser(selectedUser.id, payload)
            .then(() => {
                resetForm();
                load();
            })
            .catch(err => console.error(err));
    };

    // Helpers for UI
    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "??";

    const roleColors = {
        admin: "bg-rose-100 text-rose-700 border-rose-200",
        student: "bg-indigo-100 text-indigo-700 border-indigo-200",
        visitor: "bg-slate-100 text-slate-700 border-slate-200"
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ===== LEFT COLUMN: USERS LIST (Span 7) ===== */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Header */}
                    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-10 flex justify-between items-center">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 flex items-center gap-2">
                            User Management
                            <span className="text-sm font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                                {users.length}
                            </span>
                        </h2>
                        <button
                            onClick={resetForm}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                            + New User
                        </button>
                    </div>

                    {/* Users Grid */}
                    <div className="space-y-4">
                        {users.map(u => (
                            <div
                                key={u.id}
                                onClick={() => editUser(u)}
                                className={`group relative p-5 bg-white rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-4 ${
                                    selectedUser?.id === u.id
                                        ? "border-indigo-500 shadow-xl shadow-indigo-100 ring-1 ring-indigo-500 transform scale-[1.01]"
                                        : "border-slate-100 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-0.5"
                                }`}
                            >
                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-inner flex-shrink-0 ${
                                    selectedUser?.id === u.id ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                                }`}>
                                    {getInitials(u.name)}
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-700 transition-colors">
                                                {u.name}
                                            </h3>
                                            <p className="text-slate-400 text-sm">{u.email}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wide ${roleColors[u.role] || roleColors.visitor}`}>
                                            {u.role}
                                        </span>
                                    </div>

                                    {/* Enrolled Courses Tags */}
                                    {u.courseIds?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {u.courseIds.map(cid => {
                                                const course = courses.find(c => c.id === cid);
                                                return (
                                                    <span key={cid} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded text-xs font-medium flex items-center gap-1">
                                                        📚 {course?.title || "Unknown"}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== RIGHT COLUMN: FORM (Span 5) ===== */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6">

                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {selectedUser ? "Edit User" : "Create User"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">
                                    {selectedUser ? "Update profile details" : "Register a new member"}
                                </p>
                            </div>
                            {selectedUser && (
                                <button
                                    onClick={resetForm}
                                    className="text-xs font-medium text-slate-400 hover:text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Role Select */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Role</label>
                                <div className="relative">
                                    <select
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="student">🎓 Student</option>
                                        <option value="visitor">👤 Visitor</option>
                                        <option value="admin">🛡️ Admin</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">▼</div>
                                </div>
                            </div>

                            {/* Course Selection (Only if Student) */}
                            {role === "student" && (
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Enrolled Courses</label>
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                                        {courses.map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => toggleCourse(c.id)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                                                    courseIds.includes(c.id)
                                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                                }`}
                                            >
                                                {c.title}
                                            </button>
                                        ))}
                                        {courses.length === 0 && (
                                            <p className="text-sm text-slate-400 italic">No courses available.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions Buttons */}
                            <div className="pt-4 flex gap-3">
                                {selectedUser ? (
                                    <>
                                        <button
                                            onClick={saveUser}
                                            className="flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => removeUser(selectedUser.id)}
                                            className="py-3.5 px-4 rounded-xl font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors"
                                            title="Delete User"
                                        >
                                            🗑️
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={addUser}
                                        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-300 transition-all transform active:scale-95"
                                    >
                                        Create User
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