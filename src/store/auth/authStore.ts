import { create } from "zustand";
import { api } from "@/lib/axios";
import type { AuthResponse, LoginPayload, User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("crewpal_token"),
  status: "idle",
  error: null,

  login: async (payload: LoginPayload) => {
    set({ status: "loading", error: null });
    try {
      // Placeholder endpoint — replace with the real Crewpal auth API.
      const { data } = await api.post<AuthResponse>("/auth/login", payload);

      if (payload.rememberMe) {
        localStorage.setItem("crewpal_token", data.token);
      } else {
        sessionStorage.setItem("crewpal_token", data.token);
      }

      set({ user: data.user, token: data.token, status: "success", error: null });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "We couldn't log you in. Check your credentials and try again.";
      set({ status: "error", error: message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("crewpal_token");
    sessionStorage.removeItem("crewpal_token");
    set({ user: null, token: null, status: "idle", error: null });
  },

  clearError: () => set({ error: null }),
}));
