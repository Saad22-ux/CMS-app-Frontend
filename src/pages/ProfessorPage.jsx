import { useEffect, useState } from "react";
import { getProfessor, updateProfessor } from "../api/professorApi";

export default function ProfessorPage() {
    const [bio, setBio] = useState("");

    useEffect(() => {
        getProfessor().then(res => setBio(res.data.bio));
    }, []);

    const save = () => {
        updateProfessor({
            bio,
            skills: ["Java", "React", "XML"],
            publications: { "Web Systems": "2025" }
        });
    };

    return (
        <div className="p-10 max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Professor Profile</h2>

            <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="border w-full p-3 rounded h-40 mb-4"
            />

            <button
                onClick={save}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
                Save
            </button>
        </div>
    );
}
