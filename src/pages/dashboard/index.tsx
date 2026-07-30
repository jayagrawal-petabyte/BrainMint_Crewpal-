import { Clock, CheckCircle2, AlertCircle, BarChart2 } from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { BottomNav } from '../../components/layout/BottomNav';
import { useMemo } from 'react';

export const Dashboard = () => {
  const tasks = useTaskStore((s) => s.tasks);

  // Derive stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const delayed = tasks.filter(t => t.status === 'delayed').length;
    const onTrack = tasks.filter(t => t.status === 'on_track').length;
    
    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;

    return { total, completed, delayed, onTrack, high, medium, low };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#f5f0e1] text-[#0b170e] font-sans pb-28 px-4 pt-4 max-w-md mx-auto relative shadow-2xl animate-in fade-in duration-300">
      {/* ─── TOP HEADER ─── */}
      <div className="flex items-center justify-between py-2 mb-6">
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
            <p className="text-[9px] text-[#426348] font-medium leading-none">Dashboard Overview</p>
          </div>
        </div>

        <button className="w-10 h-10 rounded-full bg-[#1e3624] text-[#f5f0e1] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      <h2 className="text-3xl font-extrabold text-[#0b170e] mb-4 tracking-tight">Overview</h2>

      {/* ─── STATS GRID ─── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#d4d9b8] p-4 rounded-2xl border border-[#b8c094] shadow-sm card-animate" style={{ animationDelay: '50ms' }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-forest-900 opacity-70">Total Tasks</h3>
            <BarChart2 className="w-4 h-4 text-forest-800" />
          </div>
          <p className="text-3xl font-extrabold text-forest-900">{stats.total}</p>
        </div>

        <div className="bg-[#e2d3bc] p-4 rounded-2xl border border-cream-300 shadow-sm card-animate" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-forest-900 opacity-70">Completed</h3>
            <CheckCircle2 className="w-4 h-4 text-forest-800" />
          </div>
          <p className="text-3xl font-extrabold text-forest-900">{stats.completed}</p>
        </div>

        <div className="bg-[#f2cece] p-4 rounded-2xl border border-rose-300 shadow-sm card-animate" style={{ animationDelay: '150ms' }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-rose-900 opacity-70">Delayed</h3>
            <AlertCircle className="w-4 h-4 text-rose-800" />
          </div>
          <p className="text-3xl font-extrabold text-rose-900">{stats.delayed}</p>
        </div>

        <div className="bg-[#fdf8e8] p-4 rounded-2xl border border-forest-900/10 shadow-sm card-animate" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-forest-900 opacity-70">On Track</h3>
            <Clock className="w-4 h-4 text-forest-800" />
          </div>
          <p className="text-3xl font-extrabold text-forest-900">{stats.onTrack}</p>
        </div>
      </div>

      {/* ─── PRIORITY DISTRIBUTION ─── */}
      <div className="bg-white p-5 rounded-2xl border border-forest-900/10 shadow-sm mb-6 card-animate" style={{ animationDelay: '250ms' }}>
        <h3 className="text-sm font-bold text-forest-900 mb-4">Task Priority</h3>
        
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          <div style={{ width: `${(stats.high / stats.total) * 100}%` }} className="bg-rose-500 transition-all duration-1000"></div>
          <div style={{ width: `${(stats.medium / stats.total) * 100}%` }} className="bg-olive-500 transition-all duration-1000"></div>
          <div style={{ width: `${(stats.low / stats.total) * 100}%` }} className="bg-cream-400 transition-all duration-1000"></div>
        </div>

        <div className="flex justify-between text-xs font-medium text-forest-900">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div>High ({stats.high})</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-olive-500"></div>Medium ({stats.medium})</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cream-400"></div>Low ({stats.low})</div>
        </div>
      </div>

      {/* ─── RECENT TASKS ─── */}
      <div className="space-y-3 card-animate" style={{ animationDelay: '300ms' }}>
        <h3 className="text-sm font-bold text-forest-900">Recent Activity</h3>
        
        {tasks.slice(0, 3).map((task) => (
          <div key={task.id} className="bg-[#fdf8e8] p-3.5 rounded-xl border border-forest-900/20 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-forest-900/60 font-bold mb-0.5">{task.techTag}</p>
              <h4 className="text-xs font-bold text-forest-900 line-clamp-1">{task.title}</h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
              task.status === 'on_track' ? 'bg-[#d4d9b8] border-[#b8c094] text-forest-900' :
              task.status === 'delayed' ? 'bg-[#f2cece] border-[#e7a8a8] text-rose-900' :
              'bg-[#e2d3bc] border-cream-300 text-forest-900'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};
