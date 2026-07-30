import { Home, FolderKanban, Tag, Users, Image as ImageIcon, Send } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isDashboard = pathname === '/dashboard';
  const isTasks = pathname.startsWith('/tasks') || pathname === '/';
  const isTeams = pathname.startsWith('/teams') || pathname === '/users';

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1e3624] text-[#f5f0e1] px-5 py-3 rounded-full flex items-center gap-5 shadow-2xl z-40 border border-[#0b170e]/40">
      <button 
        onClick={() => navigate('/dashboard')}
        className={`hover:opacity-80 transition-all p-1 ${isDashboard ? 'scale-110' : ''}`}
      >
        <Home className={`w-5 h-5 ${isDashboard ? 'text-[#d4a0a0]' : 'text-[#f5f0e1]'}`} />
      </button>

      <button 
        onClick={() => navigate('/tasks')}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isTasks ? 'bg-[#d4a0a0] shadow-inner scale-110' : 'hover:opacity-80'}`}
      >
        <FolderKanban className={`w-5 h-5 ${isTasks ? 'text-[#0b170e]' : 'text-[#f5f0e1]'}`} />
      </button>

      <button className="hover:opacity-80 transition-opacity p-1">
        <Tag className="w-5 h-5 text-[#f5f0e1]" />
      </button>

      <button 
        onClick={() => navigate('/teams')}
        className={`hover:opacity-80 transition-all p-1 ${isTeams ? 'scale-110' : ''}`}
      >
        <Users className={`w-5 h-5 ${isTeams ? 'text-[#d4a0a0]' : 'text-[#f5f0e1]'}`} />
      </button>

      <button className="hover:opacity-80 transition-opacity p-1">
        <ImageIcon className="w-5 h-5 text-[#f5f0e1]" />
      </button>

      <button className="hover:opacity-80 transition-opacity p-1">
        <Send className="w-5 h-5 text-[#f5f0e1]" />
      </button>
    </div>
  );
};
