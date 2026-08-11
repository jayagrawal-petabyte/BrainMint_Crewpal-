import { api, TOKEN_STORAGE_KEY } from './apiClient';
import { ApiError } from './apiErrors';
import type { User } from '../contexts/AuthContext';
import { UserRole } from '../types/roles';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

interface DemoAccount {
  password: string;
  role: UserRole;
  name: string;
}

const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
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
      const res = await api.post<{ access_token?: string; token?: string; user: User }>('/auth/login', credentials);
      const token = res.access_token || res.token || '';
      if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
      return { token, user: res.user };
    } catch {
      return this.mockLogin(credentials);
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

  private async mockLogin(
    credentials: LoginCredentials
  ): Promise<LoginResponse> {
    const account = DEMO_ACCOUNTS[credentials.email.trim().toLowerCase()];

    if (!account || account.password !== credentials.password) {
      throw new ApiError(
        'unauthorized',
        'Invalid email or password.',
        401
      );
    }

    const user: User = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2),
      name: account.name,
      email: credentials.email.trim(),
      role: account.role,
    };

    const token = `mock-token-${user.id}`;
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);

    return { token, user };
  }
}

export const authService = new AuthService();
