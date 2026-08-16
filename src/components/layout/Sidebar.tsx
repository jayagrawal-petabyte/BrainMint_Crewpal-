import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Building2,
  BarChart3,
  Users,
  Bell,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/roles";
import { useTranslation } from "../../hooks/useTranslation";

export const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);

  const navItems = [
    {
      label: t.dashboard,
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
    },
    {
      label: t.tasks,
      path: "/tasks",
      icon: CheckSquare,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
    },
    {
      label: t.projects,
      path: "/projects",
      icon: FolderKanban,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
    },
    {
      label: t.organization,
      path: "/organization",
      icon: Building2,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
    },
    {
      label: t.teams,
      path: "/teams",
      icon: Users,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      label: t.reports,
      path: "/reports",
      icon: BarChart3,
      roles: [UserRole.ADMIN],
    },
    {
      label: t.notifications,
      path: "/notifications",
      icon: Bell,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
    },
    {
      label: t.scrumBoard,
      path: "/scrum",
      icon: Zap,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
    },
    {
      label: t.settings,
      path: "/settings",
      icon: Settings,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
    },
  ];

  return (
    <aside
      className={`bg-forest-800 text-cream-50 min-h-screen p-5 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-olive-400 text-forest-900 rounded-full p-1 shadow-md hover:bg-olive-300 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-olive-500"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="space-y-8 overflow-y-auto no-scrollbar pb-4">
        <div className={`flex items-center gap-3 px-2 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-xl bg-olive-400 flex items-center justify-center font-bold text-forest-900 text-lg shadow-sm shrink-0">
            CP
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-extrabold text-lg tracking-wide leading-none">
                  CREWPAL
                </h1>
                <p className="text-[10px] text-olive-300 font-medium tracking-wider uppercase mt-0.5">
                  BrainMint WorkTrack
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="space-y-1">
          {navItems
            .filter((item) => !user || item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.path} className="relative group">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-olive-400 text-forest-900 font-semibold shadow-sm"
                          : "text-cream-200 hover:bg-forest-700 hover:text-white"
                      } ${isCollapsed ? "justify-center" : ""}`
                    }
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-forest-900 text-cream-50 text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-forest-900" />
                    </div>
                  )}
                </div>
              );
            })}
        </nav>
      </div>

      <NavLink
        to={user ? "/user-dashboard" : "/login"}
        end
        className={({ isActive }) =>
          `group pt-4 border-t border-forest-700/60 flex items-center gap-3 px-2 rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-olive-500 active:scale-[0.98] ${
            isCollapsed ? "justify-center" : ""
          } ${
            isActive
              ? "bg-forest-700/70 outline outline-1 outline-olive-300/70 shadow-sm"
              : "hover:bg-forest-700/70 hover:outline hover:outline-1 hover:outline-olive-300/60 hover:shadow-sm"
          }`
        }
        aria-label="View profile"
      >
        <div className="w-8 h-8 rounded-full bg-olive-300 text-forest-900 flex items-center justify-center font-bold text-xs shrink-0 transition-colors group-hover:bg-olive-200">
          {user?.name?.charAt(0) ?? "U"}
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 min-w-0 overflow-hidden whitespace-nowrap"
            >
              <p className="text-xs font-bold text-cream-50 truncate">
                {user?.name ?? "Guest"}
              </p>
              <p className="text-[10px] text-olive-300 truncate">
                {user?.email ?? "Not logged in"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </NavLink>
    </aside>
  );
};
