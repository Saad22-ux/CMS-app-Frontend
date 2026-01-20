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
                alert("Create failed: " + JSON.stringify(err.response?.data || err.message));
            });
    };

    // Delete user
    const removeUser = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        deleteUser(id)
            .then(load)
            .catch(err => {
                console.error("Delete failed:", err.response || err);
                alert("Delete failed: " + JSON.stringify(err.response?.data || err.message));
            });

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
            .catch(err => {
                console.error("Update failed:", err.response || err);
                alert("Update failed: " + JSON.stringify(err.response?.data || err.message));
            });
    };

    return (
        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ===== Users List ===== */}
            <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-4">Users</h2>
                <ul className="space-y-2">
                    {users.map(u => (
                        <li
                            key={u.id}
                            onClick={() => editUser(u)}
                            className={`p-3 rounded cursor-pointer border transition-all duration-200 ${
                                selectedUser?.id === u.id
                                    ? "bg-blue-50 border-blue-400 shadow"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            <h3 className="font-semibold">{u.name}</h3>
                            <p className="text-gray-500 text-sm">{u.email}</p>
                            <p className="text-gray-400 text-xs mt-1">Role: {u.role}</p>
                            {u.courseIds?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {u.courseIds.map(cid => {
                                        const course = courses.find(c => c.id === cid);
                                        return (
                                            <span
                                                key={cid}
                                                className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                                            >
                        {course?.title || "Unknown"}
                      </span>
                                        );
                                    })}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* ===== User Details & Add/Edit Form ===== */}
            <div className="md:col-span-2 space-y-6">

                {/* User Form */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">{selectedUser ? "Edit User" : "Add New User"}</h2>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="border w-full px-3 py-2 rounded"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="border w-full px-3 py-2 rounded"
                        />
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="border w-full px-3 py-2 rounded"
                        >
                            <option value="student">Student</option>
                            <option value="visitor">Visitor</option>
                            <option value="admin">Admin</option>
                        </select>

                        {/* Courses selection only for students */}
                        {role === "student" && (
                            <div>
                                <label className="block font-semibold mb-2">Select Courses:</label>
                                <div className="flex flex-wrap gap-2">
                                    {courses.map(c => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => toggleCourse(c.id)}
                                            className={`px-3 py-1 rounded-full border transition-colors duration-200 ${
                                                courseIds.includes(c.id)
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                        >
                                            {c.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-3">
                            {selectedUser ? (
                                <>
                                    <button
                                        onClick={saveUser}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        onClick={() => removeUser(selectedUser.id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Delete User
                                    </button>

                                    <button
                                        onClick={resetForm}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={addUser}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Add User
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
