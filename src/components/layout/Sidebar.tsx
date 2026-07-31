import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/roles";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Folders,
  Users,
  Settings,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
  },
  {
    name: "Projects",
    path: "/projects",
    icon: Folders,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
  },
  {
    name: "Team",
    path: "/users",
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: [UserRole.ADMIN],
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-surface-200 h-screen sticky top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-surface-200">
        <h1 className="text-xl font-bold text-primary-600 tracking-tight">
          CREWPAL
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems
          .filter((item) => !user || item.roles.includes(user.role))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
      </nav>

      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-50 cursor-pointer hover:bg-surface-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name?.charAt(0) ?? "U"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">
              {user?.name ?? "Guest"}
            </p>

            <p className="text-xs text-surface-500 truncate">
              {user?.email ?? "Not logged in"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};