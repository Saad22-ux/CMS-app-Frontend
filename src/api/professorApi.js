import api from "./axiosConfig";

export const getProfessors = () => api.get("/professors");
export const createProfessor = (p) => api.post("/professors", p);
export const updateProfessor = (id, p) => api.put(`/professors/${id}`, p);
export const deleteProfessor = (id) => api.delete(`/professors/${id}`);
