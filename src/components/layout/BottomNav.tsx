import { NavLink } from 'react-router-dom';
import { Home, Folders, Tag, Users, BarChart3, Plane } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Projects', path: '/projects', icon: Folders },
  { name: 'Teams', path: '/teams', icon: Tag },
  { name: 'Calendar', path: '/calendar', icon: Users },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Chats', path: '/chats', icon: Plane },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-forest-700 rounded-full px-4 py-3 shadow-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-300 text-forest-900'
                    : 'text-cream-100 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
