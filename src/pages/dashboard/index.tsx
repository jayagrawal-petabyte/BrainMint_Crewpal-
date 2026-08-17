import {
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
} from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { BottomNav } from '../../components/layout/BottomNav';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const navigate = useNavigate();

  // ─── DERIVE STATS ───
  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (t) => t.status === 'completed'
    ).length;

    const delayed = tasks.filter(
      (t) => t.status === 'delayed'
    ).length;

    const onTrack = tasks.filter(
      (t) => t.status === 'on_track'
    ).length;

    const high = tasks.filter(
      (t) => t.priority === 'high'
    ).length;

    const medium = tasks.filter(
      (t) => t.priority === 'medium'
    ).length;

    const low = tasks.filter(
      (t) => t.priority === 'low'
    ).length;

    return {
      total,
      completed,
      delayed,
      onTrack,
      high,
      medium,
      low,
    };
  }, [tasks]);

  // ─── NAVIGATION ───
  const goToTasks = (status?: string) => {
    if (status) {
      navigate(`/tasks?status=${status}`);
    } else {
      navigate('/tasks');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e1] text-[#0b170e] font-sans pb-28 px-4 pt-4 max-w-md mx-auto relative shadow-2xl animate-in fade-in duration-300">

      {/* ─── TOP HEADER ─── */}
      <div className="flex items-center justify-center py-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg border-2 border-[#0b170e] flex items-center justify-center bg-transparent">
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L8 6L15 1"
                stroke="#0b170e"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="1"
                y="1"
                width="14"
                height="10"
                rx="1"
                stroke="#0b170e"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          <div>
            <h1 className="font-extrabold text-base tracking-widest text-[#0b170e] leading-tight uppercase">
              CREWPAL
            </h1>

            <p className="text-[9px] text-[#426348] font-medium leading-none">
              Dashboard Overview
            </p>
          </div>
        </div>
      </div>

      {/* ─── PAGE TITLE ─── */}
      <h2 className="text-3xl font-extrabold text-[#0b170e] mb-4 tracking-tight">
        Overview
      </h2>

      {/* ─── STATS GRID ─── */}
      <div className="grid grid-cols-2 gap-3 mb-6">

        {/* TOTAL TASKS */}
        <button
          type="button"
          onClick={() => goToTasks()}
          className="text-left bg-[#d4d9b8] p-4 rounded-2xl border border-[#b8c094] shadow-sm card-animate hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
          style={{ animationDelay: '50ms' }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-forest-900 opacity-70">
              Total Tasks
            </h3>

            <BarChart2 className="w-4 h-4 text-forest-800" />
          </div>

          <p className="text-3xl font-extrabold text-forest-900">
            {stats.total}
          </p>
        </button>

        {/* COMPLETED */}
        <button
          type="button"
          onClick={() => goToTasks('completed')}
          className="text-left bg-[#e2d3bc] p-4 rounded-2xl border border-cream-300 shadow-sm card-animate hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-forest-900 opacity-70">
              Completed
            </h3>

            <CheckCircle2 className="w-4 h-4 text-forest-800" />
          </div>

          <p className="text-3xl font-extrabold text-forest-900">
            {stats.completed}
          </p>
        </button>

        {/* DELAYED */}
        <button
          type="button"
          onClick={() => goToTasks('delayed')}
          className="text-left bg-[#f2cece] p-4 rounded-2xl border border-rose-300 shadow-sm card-animate hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-rose-900 opacity-70">
              Delayed
            </h3>

            <AlertCircle className="w-4 h-4 text-rose-800" />
          </div>

          <p className="text-3xl font-extrabold text-rose-900">
            {stats.delayed}
          </p>
        </button>

        {/* ON TRACK */}
        <button
          type="button"
          onClick={() => goToTasks('on_track')}
          className="text-left bg-[#fdf8e8] p-4 rounded-2xl border border-forest-900/10 shadow-sm card-animate hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-forest-900 opacity-70">
              On Track
            </h3>

            <Clock className="w-4 h-4 text-forest-800" />
          </div>

          <p className="text-3xl font-extrabold text-forest-900">
            {stats.onTrack}
          </p>
        </button>
      </div>

      {/* ─── PRIORITY DISTRIBUTION ─── */}
      <button
        type="button"
        onClick={() => goToTasks()}
        className="w-full text-left bg-white p-5 rounded-2xl border border-forest-900/10 shadow-sm mb-6 card-animate hover:shadow-md transition-all cursor-pointer"
        style={{ animationDelay: '250ms' }}
      >
        <h3 className="text-sm font-bold text-forest-900 mb-4">
          Task Priority
        </h3>

        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          <div
            style={{
              width: `${
                stats.total
                  ? (stats.high / stats.total) * 100
                  : 0
              }%`,
            }}
            className="bg-rose-500 transition-all duration-1000"
          />

          <div
            style={{
              width: `${
                stats.total
                  ? (stats.medium / stats.total) * 100
                  : 0
              }%`,
            }}
            className="bg-olive-500 transition-all duration-1000"
          />

          <div
            style={{
              width: `${
                stats.total
                  ? (stats.low / stats.total) * 100
                  : 0
              }%`,
            }}
            className="bg-cream-400 transition-all duration-1000"
          />
        </div>

        <div className="flex justify-between text-xs font-medium text-forest-900">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            High ({stats.high})
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-olive-500" />
            Medium ({stats.medium})
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cream-400" />
            Low ({stats.low})
          </div>
        </div>
      </button>

      {/* ─── RECENT TASKS ─── */}
      <div
        className="space-y-3 card-animate"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-forest-900">
            Recent Activity
          </h3>

          <button
            type="button"
            onClick={() => goToTasks()}
            className="text-[10px] font-bold text-forest-800 hover:underline"
          >
            View All
          </button>
        </div>

        {tasks.slice(0, 3).map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => goToTasks()}
            className="w-full text-left bg-[#fdf8e8] p-3.5 rounded-xl border border-forest-900/20 flex justify-between items-center hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div>
              <p className="text-[10px] text-forest-900/60 font-bold mb-0.5">
                {task.techTag}
              </p>

              <h4 className="text-xs font-bold text-forest-900 line-clamp-1">
                {task.title}
              </h4>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                task.status === 'on_track'
                  ? 'bg-[#d4d9b8] border-[#b8c094] text-forest-900'
                  : task.status === 'delayed'
                    ? 'bg-[#f2cece] border-[#e7a8a8] text-rose-900'
                    : 'bg-[#e2d3bc] border-cream-300 text-forest-900'
              }`}
            >
              {task.status.replace('_', ' ')}
            </span>
          </button>
        ))}
      </div>

      {/* ─── BOTTOM NAVIGATION ─── */}
      <BottomNav />
    </div>
  );
};