// /olejra-frontend/src/api/auth.js
import { api } from "./axios";

// Small helper around login endpoint
// Returns a normalized shape so components can check ok/status/data
export async function login({ email, password }) {
  try {
    // axios throws on 400/401/500 now, so successful = valid credentials
    const res = await api.post("/auth/login", { email, password });

    return {
      ok: true,
      status: res.status,
      data: res.data,
    };
  } catch (err) {
    // Normalize error response
    const status = err?.response?.status ?? 500;
    const data = err?.response?.data ?? { message: "Unknown error" };

    return {
      ok: false,
      status,
      data,
    };
  }
}
