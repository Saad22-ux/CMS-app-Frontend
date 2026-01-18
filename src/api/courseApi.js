import api from "./axiosConfig";

export const getCourses = () => api.get("/courses");
export const createCourse = (course) => api.post("/courses", course);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);