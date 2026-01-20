import api from "./axiosConfig";

export const getCourses = () => api.get("/courses");
export const createCourse = (c) => api.post("/courses", c);
export const updateCourse = (id, c) => api.put(`${"/courses"}/${id}`, c);
export const deleteCourse = (id) => api.delete(`${"/courses"}/${id}`);
export const searchCourses = (q) => api.get(`${"/courses"}/search?q=${q}`);
export const filterCourses = (id) => api.get(`${"/courses"}/filter?professorId=${id}`);
