import axios from "axios";

/**
 * Placeholder Axios instance.
 * Swap `baseURL` for the real Crewpal backend once it exists,
 * and wire up interceptors for auth tokens / refresh flow.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://crewpal-backend.onrender.com",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("crewpal_token") ||
    sessionStorage.getItem("crewpal_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized place to handle 401s, refresh tokens, etc. once the real API exists.
    return Promise.reject(error);
  }
);
