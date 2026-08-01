import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/roles";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      setEmailError("Enter a valid email address");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    let role: UserRole;
    let name: string;

    switch (email.trim().toLowerCase()) {
      case "admin@brainmint.com":
        if (password !== "admin123") {
          alert("Invalid password");
          return;
        }
        role = UserRole.ADMIN;
        name = "Admin User";
        break;

      case "manager@brainmint.com":
        if (password !== "manager123") {
          alert("Invalid password");
          return;
        }
        role = UserRole.MANAGER;
        name = "Manager User";
        break;

      case "employee@brainmint.com":
        if (password !== "employee123") {
          alert("Invalid password");
          return;
        }
        role = UserRole.EMPLOYEE;
        name = "Employee User";
        break;

      default:
        alert("Invalid email");
        return;
    }

    login({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      name,
      email: email.trim(),
      role,
    });

    navigate("/tasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4E8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          WorkTrack Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {emailError && (
              <p className="text-red-600 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!email.trim() || !password.trim()}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;