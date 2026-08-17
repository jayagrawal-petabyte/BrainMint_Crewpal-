export interface User {
  id: string;
  name: string;
  email: string;
  role: "intern" | "manager" | "admin";
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export * from './organization';

