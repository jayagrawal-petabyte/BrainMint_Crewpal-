import { MOCK_TEAM_MEMBERS, useTaskStore } from '../../store/tasks';
import { BottomNav } from '../../components/layout/BottomNav';
import { Search, ChevronDown, UserPlus, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export const Teams = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const [search, setSearch] = useState('');

  // Calculate task counts per user
  const getUserTaskCount = (userId: string) => {
    return tasks.filter(t => t.assignees.some(a => a.id === userId)).length;
  };

  const filteredMembers = MOCK_TEAM_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f0e1] text-[#0b170e] font-sans pb-28 px-4 pt-4 max-w-md mx-auto relative shadow-2xl animate-in fade-in duration-300">
      {/* ─── TOP HEADER ─── */}
      <div className="flex items-center justify-between py-2 mb-4">
        <button className="p-1.5 text-[#0b170e] hover:opacity-80 transition-opacity">
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="14" height="3" rx="1.5" fill="#0b170e" />
            <rect y="7" width="22" height="3" rx="1.5" fill="#0b170e" />
            <rect y="14" width="18" height="2" rx="1" fill="#0b170e" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg border-2 border-[#0b170e] flex items-center justify-center bg-transparent">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L8 6L15 1" stroke="#0b170e" strokeWidth="2" strokeLinecap="round" />
              <rect x="1" y="1" width="14" height="10" rx="1" stroke="#0b170e" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-widest text-[#0b170e] leading-tight uppercase">CREWPAL</h1>
            <p className="text-[9px] text-[#426348] font-medium leading-none">Team Members</p>
          </div>
        </div>

        <button className="w-10 h-10 rounded-full bg-[#1e3624] text-[#f5f0e1] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      <h2 className="text-3xl font-extrabold text-[#0b170e] mb-4 tracking-tight">Team</h2>

      {/* ─── SEARCH & ADD ROW ─── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-[#f2cece]/60 border border-[#e7a8a8] rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-[#426348] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team member"
            className="w-full bg-transparent text-xs text-[#0b170e] placeholder:text-[#426348]/70 outline-none font-medium"
          />
          <ChevronDown className="w-4 h-4 text-[#426348] shrink-0" />
        </div>

        <button className="flex items-center gap-1.5 bg-[#1e3624] hover:bg-[#142619] text-[#f5f0e1] px-4 py-2 rounded-full text-xs font-bold shrink-0 shadow-md transition-all active:scale-95">
          <UserPlus className="w-3.5 h-3.5" />
          Invite
        </button>
      </div>

      {/* ─── MEMBER LIST ─── */}
      <div className="space-y-3">
        {filteredMembers.map((member, idx) => (
          <div 
            key={member.id} 
            className="bg-[#fdf8e8] border border-forest-900/20 rounded-xl p-4 flex items-center gap-4 card-animate hover:shadow-md transition-all cursor-pointer"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`w-12 h-12 rounded-full ${member.avatarColor} border-2 border-forest-900 flex items-center justify-center text-forest-900 font-extrabold text-lg`}>
              {member.initials}
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-bold text-forest-900">{member.name}</h3>
              <p className="text-[10px] text-forest-900/60 font-medium">{getUserTaskCount(member.id)} Active Tasks</p>
            </div>

            <button className="p-2 text-forest-900/50 hover:text-forest-900 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};
