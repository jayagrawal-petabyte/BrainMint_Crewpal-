import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, BarChart3, Users, Bell } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Teams', path: '/users', icon: Users },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <aside className="w-64 bg-forest-800 text-cream-50 min-h-screen p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-olive-400 flex items-center justify-center font-bold text-forest-900 text-lg shadow-sm">
            CP
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide leading-none">CREWPAL</h1>
            <p className="text-[10px] text-olive-300 font-medium tracking-wider uppercase mt-0.5">BrainMint WorkTrack</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-olive-400 text-forest-900 font-semibold shadow-sm'
                      : 'text-cream-200 hover:bg-forest-700 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile summary */}
      <div className="pt-4 border-t border-forest-700/60 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-olive-300 text-forest-900 flex items-center justify-center font-bold text-xs">
          HG
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-cream-50 truncate">Harsh Gupta</p>
          <p className="text-[10px] text-olive-300 truncate">Intern Lead</p>
        </div>
      </div>
    </aside>
  );
};
