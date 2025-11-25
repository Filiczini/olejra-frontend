import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5174";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let interceptorAttached = false;
if (!interceptorAttached) {
  interceptorAttached = true;
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err?.response?.status === 401) {
        try {
          await api.post("/auth/logout");
        } catch (_) {}

        if (window.location.pathname !== "/") {
          window.location.assign("/");
        }
      }
      return Promise.reject(err);
    }
  );
}
