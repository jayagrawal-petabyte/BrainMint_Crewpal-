import { api, TOKEN_STORAGE_KEY } from './apiClient';
import type { User } from '../contexts/AuthContext';

import { UserRole } from '../types/roles';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

const DEMO_ACCOUNTS: Record<string, { password: string; role: UserRole; name: string }> = {
  'admin@brainmint.com': {
    password: 'admin123',
    role: UserRole.ADMIN,
    name: 'Admin User',
  },
  'manager@brainmint.com': {
    password: 'manager123',
    role: UserRole.MANAGER,
    name: 'Manager User',
  },
  'employee@brainmint.com': {
    password: 'employee123',
    role: UserRole.EMPLOYEE,
    name: 'Employee User',
  },
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
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
    } catch (err) {
      const emailLower = credentials.email.trim().toLowerCase();
      const demo = DEMO_ACCOUNTS[emailLower];
      if (demo && demo.password === credentials.password) {
        const token = `demo-token-${demo.role.toLowerCase()}-${Date.now()}`;
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
        return {
          access_token: token,
          user: {
            id: `demo-${demo.role.toLowerCase()}`,
            name: demo.name,
            email: credentials.email.trim(),
            role: demo.role,
          },
        };
      }
      throw err;
    }
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
