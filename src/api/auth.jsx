// /olejra-frontend/src/api/auth.js
import { api } from "./axios";

// Small helper around login endpoint
// Returns a normalized shape so components can check ok/status/data
export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });

  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    data: res.data,
  };
}
