import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { UserRole } from "../types/roles";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  project?: string;
  joiningDate?: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("crewpal_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem("crewpal_user", JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save user in localStorage", e);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("crewpal_user");
    localStorage.removeItem("crewpal_token");
    sessionStorage.removeItem("crewpal_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}