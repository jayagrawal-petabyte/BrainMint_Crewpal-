export interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "manager" | "admin";
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role_id: number;
    organization_id: number;
  };
}

export * from './organization';

