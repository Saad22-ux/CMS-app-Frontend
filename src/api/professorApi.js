// src/api/professorApi.js
import api from "./axiosConfig";

export const getProfessor = () => api.get("/professor");
export const updateProfessor = (data) => api.put("/professor", data);
