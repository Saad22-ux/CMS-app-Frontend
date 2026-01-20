import { useEffect, useState } from "react";
import {
    getProfessors,
    createProfessor,
    deleteProfessor
} from "../api/professorApi";
import "../styles/professor.css";

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

    const updateField = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const updateSkill = (i, value) => {
        const skills = [...form.skills];
        skills[i] = value;
        setForm({ ...form, skills });
    };

    const addSkill = () => {
        setForm({ ...form, skills: [...form.skills, ""] });
    };

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

    const submit = () => {

        const payload = {
            name: form.name,
            bio: form.bio,
            skills: form.skills.filter(s => s.trim() !== ""),
            publications: Object.fromEntries(
                form.publications
                    .filter(p => p.title && p.year)
                    .map(p => [p.title, p.year])
            )
        };

        createProfessor(payload).then(() => {
            setForm(emptyProfessor);
            load();
        });
    };

    return (
        <div className="professor-container">

            <h2>👨‍🏫 Gestion des Professeurs</h2>

            {/* FORM */}
            <div className="card">

                <input
                    placeholder="Nom"
                    value={form.name}
                    onChange={e => updateField("name", e.target.value)}
                />

                <textarea
                    placeholder="Biographie"
                    value={form.bio}
                    onChange={e => updateField("bio", e.target.value)}
                />

                <h4>Compétences</h4>
                {form.skills.map((s, i) => (
                    <input
                        key={i}
                        placeholder="Skill"
                        value={s}
                        onChange={e => updateSkill(i, e.target.value)}
                    />
                ))}
                <button onClick={addSkill}>➕ Ajouter compétence</button>

                <h4>Publications</h4>
                {form.publications.map((p, i) => (
                    <div key={i} className="row">
                        <input
                            placeholder="Titre"
                            value={p.title}
                            onChange={e =>
                                updatePublication(i, "title", e.target.value)
                            }
                        />
                        <input
                            placeholder="Année"
                            value={p.year}
                            onChange={e =>
                                updatePublication(i, "year", e.target.value)
                            }
                        />
                    </div>
                ))}
                <button onClick={addPublication}>➕ Ajouter publication</button>

                <button className="save" onClick={submit}>
                    💾 Enregistrer
                </button>
            </div>

            {/* LIST */}
            <div className="grid">
                {list.map(p => (
                    <div className="card" key={p.id}>
                        <h3>{p.name}</h3>
                        <p>{p.bio}</p>

                        <b>Skills</b>
                        <ul>
                            {p.skills.map((s,i) => <li key={i}>{s}</li>)}
                        </ul>

                        <b>Publications</b>
                        <ul>
                            {Object.entries(p.publications).map(([t,y],i) =>
                                <li key={i}>{t} ({y})</li>
                            )}
                        </ul>

                        <button
                            className="delete"
                            onClick={() =>
                                deleteProfessor(p.id).then(load)
                            }>
                            🗑 Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
