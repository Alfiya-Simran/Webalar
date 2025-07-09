import axios from "axios";

// ✅ Add `/api` to the base URL
const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
