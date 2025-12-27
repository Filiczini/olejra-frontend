export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
};

export type LoginResponse = {
  user: AuthUser;
};