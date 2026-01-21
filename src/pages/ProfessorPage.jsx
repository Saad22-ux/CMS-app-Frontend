import { useEffect, useState } from "react";
import {
    getProfessors,
    createProfessor,
    deleteProfessor
} from "../api/professorApi";

export default function ProfessorsPage() {

    const emptyProfessor = {
        name: "",
        bio: "",
        skills: [""],
        publications: [{ title: "", year: "" }]
    };

    const [form, setForm] = useState(emptyProfessor);
    const [list, setList] = useState([]);

    const load = () => {
        getProfessors().then(res => setList(res.data));
    };

    useEffect(load, []);

    // Form Handlers
    const updateField = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    // --- Skills Management ---
    const updateSkill = (i, value) => {
        const skills = [...form.skills];
        skills[i] = value;
        setForm({ ...form, skills });
    };

    const addSkill = () => {
        setForm({ ...form, skills: [...form.skills, ""] });
    };

    const removeSkill = (i) => {
        const skills = form.skills.filter((_, index) => index !== i);
        setForm({ ...form, skills });
    };

    // --- Publications Management ---
    const updatePublication = (i, field, value) => {
        const pubs = [...form.publications];
        pubs[i][field] = value;
        setForm({ ...form, publications: pubs });
    };

    const addPublication = () => {
        setForm({
            ...form,
            publications: [...form.publications, { title: "", year: "" }]
        });
    };

    const removePublication = (i) => {
        const pubs = form.publications.filter((_, index) => index !== i);
        setForm({ ...form, publications: pubs });
    };

    // --- Submit ---
    const submit = () => {
        const payload = {
            name: form.name,
            bio: form.bio,
            skills: form.skills.filter(s => s.trim() !== ""),
            // Convert Array to Map/Object for backend
            publications: Object.fromEntries(
                form.publications
                    .filter(p => p.title && p.year)
                    .map(p => [p.title, p.year])
            )
        };

        createProfessor(payload).then(() => {
            setForm(emptyProfessor);
            load();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // Helper: Initials for avatar
    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "PR";

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ===== LEFT COLUMN: LIST (Span 7) ===== */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Header */}
                    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-10">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-2">
                            Faculty Members
                            <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                {list.length}
                            </span>
                        </h2>
                    </div>

                    {/* Professors Cards */}
                    <div className="grid grid-cols-1 gap-5">
                        {list.map(p => (
                            <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg shadow-inner">
                                            {getInitials(p.name)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{p.name}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-2 max-w-md">{p.bio}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteProfessor(p.id).then(load)}
                                        className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                                        title="Delete Professor"
                                    >
                                        🗑
                                    </button>
                                </div>

                                {/* Skills Tags */}
                                {p.skills && p.skills.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Expertise</p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.skills.map((s, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg text-xs font-semibold">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Publications List */}
                                {p.publications && Object.keys(p.publications).length > 0 && (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide flex items-center gap-1">
                                            📖 Recent Publications
                                        </p>
                                        <ul className="space-y-2">
                                            {Object.entries(p.publications).slice(0, 3).map(([title, year], i) => (
                                                <li key={i} className="text-sm text-slate-600 flex justify-between items-center">
                                                    <span className="truncate mr-4 font-medium italic">"{title}"</span>
                                                    <span className="bg-white px-2 py-0.5 rounded text-xs text-slate-400 border border-slate-200">{year}</span>
                                                </li>
                                            ))}
                                            {Object.keys(p.publications).length > 3 && (
                                                <li className="text-xs text-indigo-500 pt-1 font-medium">
                                                    + {Object.keys(p.publications).length - 3} more...
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}

                        {list.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                No professors registered yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== RIGHT COLUMN: FORM (Span 5) ===== */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6">

                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-800">Add Professor</h2>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">New Faculty Profile</p>
                        </div>

                        <div className="space-y-5">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Full Name</label>
                                <input
                                    placeholder="e.g. Dr. Alice Smith"
                                    value={form.name}
                                    onChange={e => updateField("name", e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Biography</label>
                                <textarea
                                    placeholder="Short professional bio..."
                                    rows="3"
                                    value={form.bio}
                                    onChange={e => updateField("bio", e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>

                            {/* Dynamic Skills */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Skills</label>
                                    <button onClick={addSkill} className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-2 py-1 rounded">
                                        + Add
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {form.skills.map((s, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                placeholder={`Skill #${i + 1}`}
                                                value={s}
                                                onChange={e => updateSkill(i, e.target.value)}
                                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                            />
                                            {form.skills.length > 1 && (
                                                <button onClick={() => removeSkill(i)} className="text-slate-400 hover:text-rose-500 px-2">✕</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamic Publications */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Publications</label>
                                    <button onClick={addPublication} className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-2 py-1 rounded">
                                        + Add
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {form.publications.map((p, i) => (
                                        <div key={i} className="flex gap-2 items-start">
                                            <div className="flex-1 space-y-1">
                                                <input
                                                    placeholder="Publication Title"
                                                    value={p.title}
                                                    onChange={e => updatePublication(i, "title", e.target.value)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                                />
                                                <input
                                                    placeholder="Year"
                                                    type="number"
                                                    value={p.year}
                                                    onChange={e => updatePublication(i, "year", e.target.value)}
                                                    className="w-1/3 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                            {form.publications.length > 1 && (
                                                <button onClick={() => removePublication(i)} className="text-slate-400 hover:text-rose-500 px-2 mt-2">✕</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={submit}
                                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-300 transition-all transform active:scale-95 mt-4"
                            >
                                💾 Save Professor
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}