import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  withCredentials: true,
});


API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("lifeflow_user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);
export const updateProfile = (data) => API.put("/auth/profile", data);
export const getMe         = ()     => API.get("/auth/me");

// Donors
export const searchDonors = (params) => API.get("/auth/donors/search", { params });

// Requests
export const getAllRequests     = (params) => API.get("/requests", { params });
export const createRequest      = (data)   => API.post("/requests", data);
export const getMyRequests      = ()       => API.get("/requests/mine");
export const updateRequestStatus= (id, status) => API.put(`/requests/${id}/status`, { status });
export const deleteRequest      = (id)    => API.delete(`/requests/${id}`);

// Admin
export const getStats           = ()     => API.get("/admin/stats");
export const getAllUsers         = ()     => API.get("/admin/users");
export const toggleBlockUser    = (id)   => API.put(`/admin/users/${id}/block`);
export const deleteUser         = (id)   => API.delete(`/admin/users/${id}`);
export const getAllRequestsAdmin = ()     => API.get("/admin/requests");

export default API;