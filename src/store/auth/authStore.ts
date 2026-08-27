import { create } from "zustand";
import { api } from "@/lib/axios";
import type { AuthResponse, LoginPayload, User } from "@/types";

const roleFromRoleId = (roleId: number): User["role"] => {
  const roleMap: Record<number, User["role"]> = {
    1: "admin",
    2: "admin",
    3: "admin",
    4: "manager",
    5: "manager",
    6: "intern",
    7: "intern",
    8: "intern",
    9: "intern",
  };

  const role = roleMap[roleId];
  return role || "intern";
};

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetStatus: "idle" | "loading" | "success" | "error";
  resetError: string | null;
  clearResetError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token:
    localStorage.getItem("crewpal_token") ||
    sessionStorage.getItem("crewpal_token"),
  status: "idle",
  error: null,

  login: async (payload: LoginPayload) => {
    set({ status: "loading", error: null });
    try {
      const { rememberMe, ...loginCredentials } = payload;
      const { data } = await api.post<AuthResponse>(
        "/auth/login",
        loginCredentials
      );

      const authToken = data.access_token;

      const user: User = {
        id: String(data.user.id),
        name: data.user.name,
        email: data.user.email,
        role: roleFromRoleId(data.user.role_id),
      };

      if (payload.rememberMe) {
        localStorage.setItem("crewpal_token", authToken);
      } else {
        sessionStorage.setItem("crewpal_token", authToken);
      }

      set({ user, token: authToken, status: "success", error: null });
    } catch (err) {
      const rawMessage = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
      const message = Array.isArray(rawMessage)
        ? rawMessage.join(", ")
        : typeof rawMessage === "string"
          ? rawMessage
          : (err as { message?: string })?.message ??
            "We couldn't log you in. Check your credentials and try again.";
      set({ status: "error", error: message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("crewpal_token");
    localStorage.removeItem("crewpal_user");
    localStorage.removeItem("crewpal_access_token");
    sessionStorage.removeItem("crewpal_token");
    set({ user: null, token: null, status: "idle", error: null });
  },

  clearError: () => set({ error: null }),

  resetStatus: "idle",
  resetError: null,

  requestPasswordReset: async (email: string) => {
    set({ resetStatus: "loading", resetError: null });
    try {
      // Placeholder endpoint — replace with the real Crewpal password-reset API.
      await api.post("/auth/forgot-password", { email });
      set({ resetStatus: "success" });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "We couldn't send the reset link. Please try again.";
      set({ resetStatus: "error", resetError: message });
      throw err;
    }
  },

  clearResetError: () => set({ resetError: null }),
}));
