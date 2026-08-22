import { api, TOKEN_STORAGE_KEY } from './apiClient';
import type { User } from '../contexts/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<{
      access_token: string;
      user: {
        id: number;
        name: string;
        email: string;
        role_id: number;
      };
    }>('/auth/login', credentials);

    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);

    return {
      access_token: response.access_token,
      user: {
        id: String(response.user.id),
        name: response.user.name,
        email: response.user.email,
        role: response.user.role_id <= 3
          ? 'ADMIN'
          : response.user.role_id <= 5
            ? 'MANAGER'
            : 'EMPLOYEE',
      },
    };
  }

  async logout(): Promise<void> {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      return null;
    }

    try {
      return await api.get<User>('/auth/me');
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
