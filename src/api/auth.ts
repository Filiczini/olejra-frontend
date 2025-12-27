import { api } from "./axios";
import { ApiResult } from "../types/api";
import { LoginRequest, LoginResponse } from "../types/auth";

export async function login(payload: LoginRequest): Promise<ApiResult<LoginResponse>> {
  const res = await api.post("/auth/login", payload);

  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    data: res.data,
  };
}