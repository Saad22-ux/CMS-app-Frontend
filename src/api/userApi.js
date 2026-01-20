import api from "./axiosConfig";

export const getUsers = () => api.get("/users");
export const createUser = (user) => api.post("/users", user);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);