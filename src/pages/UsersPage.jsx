import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../api/userApi";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");

    const load = () => {
        getUsers().then(res => setUsers(res.data));
    };

    useEffect(load, []);

    // Add new user
    const addUser = () => {
        if (!name || !email) return alert("Name and Email are required");

        createUser({
            name,
            email,
            role,
            courseIds: []
        }).then(() => {
            setName(""); setEmail(""); setRole("student");
            load();
        });
    };

    // Delete user
    const removeUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(id).then(load);
            setSelectedUser(null);
        }
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
                            onClick={() => setSelectedUser(u)}
                            className={`p-3 rounded cursor-pointer border ${
                                selectedUser?.id === u.id ? "bg-green-100 border-green-400" : "bg-white"
                            }`}
                        >
                            <h3 className="font-semibold">{u.name}</h3>
                            <p className="text-gray-500 text-sm">{u.email}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ===== User Details & Add Form ===== */}
            <div className="md:col-span-2 space-y-6">

                {/* User Details */}
                {selectedUser ? (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-2">{selectedUser.name}</h2>
                        <p className="text-gray-600 mb-1"><strong>Email:</strong> {selectedUser.email}</p>
                        <p className="text-gray-600 mb-4"><strong>Role:</strong> {selectedUser.role}</p>

                        <button
                            onClick={() => removeUser(selectedUser.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete User
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-2">Select a user to see details</h2>
                    </div>
                )}

                {/* Add User Form */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Add New User</h2>

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

                        <button
                            onClick={addUser}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Add User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
