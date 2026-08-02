import { useState, useMemo } from 'react';
import {
  Zap, Calendar, CheckCircle2, Clock, ChevronRight,
  Plus, X, Target, TrendingDown, Users, Flag,
  ArrowRight, BarChart2, ListTodo, Layers
} from 'lucide-react';
import { useSprintStore } from '../../store/sprints/sprintStore';
import { useTaskStore } from '../../store/tasks';
import type { Sprint } from '../../types/sprint';

// ─── Status badge ──────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: Sprint['status'] }) => {
  const map = {
    planned:   { label: 'Planned',   cls: 'bg-cream-200 text-forest-600' },
    active:    { label: 'Active',    cls: 'bg-emerald-100 text-emerald-800' },
    completed: { label: 'Completed', cls: 'bg-forest-200 text-forest-800' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
};

// ─── Burndown Chart (SVG) ──────────────────────────────────────────────────

const BurndownChart = ({ sprint }: { sprint: Sprint }) => {
  const start  = new Date(sprint.startDate).getTime();
  const end    = new Date(sprint.endDate).getTime();
  const total  = Math.ceil((end - start) / 86_400_000) || 1;
  const today  = Math.min(Math.ceil((Date.now() - start) / 86_400_000), total);

  // ideal line: total points → 0 over sprint days
  const TOTAL_PTS = 40;
  const W = 300, H = 120, PAD = { t: 10, r: 10, b: 28, l: 32 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;

  const xScale = (day: number) => PAD.l + (day / total) * iW;
  const yScale = (pts: number) => PAD.t + (1 - pts / TOTAL_PTS) * iH;

  // ideal line
  const idealPts = [
    { d: 0, p: TOTAL_PTS },
    { d: total, p: 0 },
  ];

  // actual burn (mock: slightly worse than ideal up to today)
  const actualPts: { d: number; p: number }[] = [];
  for (let d = 0; d <= today; d++) {
    const ideal = TOTAL_PTS - (TOTAL_PTS * d) / total;
    const noise = Math.sin(d * 1.5) * 3;
    actualPts.push({ d, p: Math.max(0, ideal + noise + (d * 0.4)) });
  }

  const polyline = (pts: { d: number; p: number }[]) =>
    pts.map((p) => `${xScale(p.d).toFixed(1)},${yScale(p.p).toFixed(1)}`).join(' ');

  // x-axis labels (show 5 evenly spaced)
  const xLabels = [0, Math.round(total * 0.25), Math.round(total * 0.5), Math.round(total * 0.75), total];

  return (
    <div className="bg-cream-50 rounded-2xl border border-cream-200 p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown className="w-4 h-4 text-forest-700" />
        <span className="text-xs font-bold text-forest-900">Burndown Chart</span>
        <div className="ml-auto flex items-center gap-3 text-[10px] text-forest-500">
          <span className="flex items-center gap-1"><span className="w-5 h-0.5 bg-cream-400 inline-block rounded" /> Ideal</span>
          <span className="flex items-center gap-1"><span className="w-5 h-0.5 bg-forest-700 inline-block rounded" /> Actual</span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={PAD.l} x2={W - PAD.r} y1={yScale(f * TOTAL_PTS)} y2={yScale(f * TOTAL_PTS)}
            stroke="#e5dfc8" strokeWidth="0.5" />
        ))}
        {/* Y-axis labels */}
        {[0, 10, 20, 30, 40].map((v) => (
          <text key={v} x={PAD.l - 4} y={yScale(v) + 3.5} fontSize="7" fill="#6b6b4e" textAnchor="end">{v}</text>
        ))}
        {/* X-axis labels */}
        {xLabels.map((d) => (
          <text key={d} x={xScale(d)} y={H - 6} fontSize="7" fill="#6b6b4e" textAnchor="middle">D{d}</text>
        ))}
        {/* Today marker */}
        <line x1={xScale(today)} x2={xScale(today)} y1={PAD.t} y2={PAD.t + iH}
          stroke="#d4a96a" strokeWidth="1" strokeDasharray="3,2" />
        <text x={xScale(today)} y={PAD.t - 2} fontSize="7" fill="#d4a96a" textAnchor="middle">Today</text>
        {/* Ideal line */}
        <polyline points={polyline(idealPts)} fill="none" stroke="#c7bda8" strokeWidth="1.5" strokeDasharray="4,3" />
        {/* Actual line */}
        <polyline points={polyline(actualPts)} fill="none" stroke="#2d5016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Actual dots */}
        {actualPts.filter((_, i) => i % 2 === 0 || i === actualPts.length - 1).map((p) => (
          <circle key={p.d} cx={xScale(p.d)} cy={yScale(p.p)} r="2.5" fill="#2d5016" />
        ))}
      </svg>
    </div>
  );
};

// ─── Sprint Card ───────────────────────────────────────────────────────────

const SprintCard = ({
  sprint,
  isSelected,
  onSelect,
  onStart,
  onComplete,
}: {
  sprint: Sprint;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
  onComplete: () => void;
}) => {
  const days = Math.ceil(
    (new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / 86_400_000
  );

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-forest-700 bg-forest-900 text-cream-50 shadow-lg scale-[1.01]'
          : 'border-cream-200 bg-white hover:border-forest-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-cream-50' : 'text-forest-900'}`}>
          {sprint.name}
        </p>
        <StatusBadge status={sprint.status} />
      </div>
      <p className={`text-xs mb-3 line-clamp-2 ${isSelected ? 'text-cream-200' : 'text-forest-500'}`}>
        {sprint.goal}
      </p>
      <div className={`flex items-center gap-3 text-[11px] ${isSelected ? 'text-cream-300' : 'text-forest-400'}`}>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {days}d sprint</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(sprint.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
      </div>

      {/* Action buttons */}
      {isSelected && sprint.status === 'planned' && (
        <button
          onClick={(e) => { e.stopPropagation(); onStart(); }}
          className="mt-3 w-full py-2 text-xs font-bold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" /> Start Sprint
        </button>
      )}
      {isSelected && sprint.status === 'active' && (
        <button
          onClick={(e) => { e.stopPropagation(); onComplete(); }}
          className="mt-3 w-full py-2 text-xs font-bold bg-cream-50 text-forest-900 rounded-xl hover:bg-cream-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Complete Sprint
        </button>
      )}
    </div>
  );
};

// ─── Sprint Backlog ────────────────────────────────────────────────────────

const DEMO_BACKLOG = [
  { id: 'b1', title: 'Design system tokens',           priority: 'high',   points: 5,  assignee: 'JA' },
  { id: 'b2', title: 'Build global search (Ctrl+K)',   priority: 'high',   points: 8,  assignee: 'DG' },
  { id: 'b3', title: 'Activity timeline component',    priority: 'medium', points: 5,  assignee: 'DG' },
  { id: 'b4', title: 'File upload & attachment UI',    priority: 'medium', points: 3,  assignee: 'DG' },
  { id: 'b5', title: 'Sprint burndown chart',          priority: 'medium', points: 5,  assignee: 'DG' },
  { id: 'b6', title: 'RBAC route protection',          priority: 'low',    points: 3,  assignee: 'RP' },
  { id: 'b7', title: 'Kanban board view',              priority: 'high',   points: 8,  assignee: 'GM' },
  { id: 'b8', title: 'Error boundary component',       priority: 'low',    points: 2,  assignee: 'NA' },
  { id: 'b9', title: 'Notification preferences UI',    priority: 'medium', points: 3,  assignee: 'DG' },
  { id: 'b10', title: 'Organization member invite',    priority: 'medium', points: 5,  assignee: 'SK' },
];

const PRIORITY_COLORS: Record<string, string> = {
  high:   'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-sky-100 text-sky-700',
};

const ASSIGNEE_COLORS: Record<string, string> = {
  DG: 'bg-violet-200 text-violet-800',
  JA: 'bg-emerald-200 text-emerald-800',
  RP: 'bg-rose-200 text-rose-800',
  GM: 'bg-amber-200 text-amber-800',
  NA: 'bg-sky-200 text-sky-800',
  SK: 'bg-pink-200 text-pink-800',
};

const BacklogItem = ({
  item,
  assigned,
  onAssign,
  onUnassign,
}: {
  item: (typeof DEMO_BACKLOG)[0];
  assigned: boolean;
  onAssign: () => void;
  onUnassign: () => void;
}) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
    assigned ? 'border-forest-300 bg-forest-50' : 'border-cream-200 bg-white hover:border-cream-300'
  }`}>
    <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${ASSIGNEE_COLORS[item.assignee] || 'bg-cream-200 text-forest-700'}`}>
      {item.assignee}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-xs font-semibold truncate ${assigned ? 'text-forest-800 line-through opacity-60' : 'text-forest-900'}`}>
        {item.title}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[item.priority]}`}>
          {item.priority}
        </span>
        <span className="text-[10px] text-forest-400">{item.points} pts</span>
      </div>
    </div>
    <button
      onClick={assigned ? onUnassign : onAssign}
      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
        assigned
          ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
          : 'bg-forest-900 text-cream-50 hover:bg-forest-700'
      }`}
    >
      {assigned ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
    </button>
  </div>
);

// ─── Tab Bar ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'board',   label: 'Sprints',  icon: Layers },
  { id: 'backlog', label: 'Backlog',  icon: ListTodo },
  { id: 'chart',   label: 'Burndown', icon: BarChart2 },
] as const;

type Tab = (typeof TABS)[number]['id'];

// ─── Main Scrum Page ───────────────────────────────────────────────────────

export const Scrum = () => {
  const { sprints, startSprint, completeSprint } = useSprintStore();
  const tasks = useTaskStore((s) => s.tasks);

  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints[0]?.id ?? '');
  const [assignedItems, setAssignedItems] = useState<Set<string>>(new Set(['b2', 'b3', 'b4', 'b5', 'b9']));

  const selectedSprint = useMemo(
    () => sprints.find((s) => s.id === selectedSprintId),
    [sprints, selectedSprintId]
  );

  // Stats for selected sprint
  const activeSprint = sprints.find((s) => s.status === 'active');
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount     = tasks.length;
  const assignedCount  = assignedItems.size;
  const totalPoints    = DEMO_BACKLOG.filter((i) => assignedItems.has(i.id))
    .reduce((acc, i) => acc + i.points, 0);

  return (
    <div className="min-h-screen bg-[#f5f0e1] pb-24">
      {/* ─── Header ─── */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-extrabold text-forest-900 tracking-tight">Scrum Board</h1>
          {activeSprint && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
              <Zap className="w-3 h-3" /> Sprint Active
            </span>
          )}
        </div>
        <p className="text-xs text-forest-500">Sprint planning, backlog & burndown</p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          {[
            { label: 'Assigned',  val: assignedCount,   icon: Users,        color: 'text-violet-700 bg-violet-100' },
            { label: 'Completed', val: completedCount,   icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-100' },
            { label: 'Story Pts', val: totalPoints,      icon: Target,       color: 'text-amber-700 bg-amber-100' },
          ].map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-cream-200 p-3 text-center shadow-sm">
              <div className={`w-7 h-7 rounded-xl mx-auto mb-1.5 flex items-center justify-center ${color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-extrabold text-forest-900">{val}</p>
              <p className="text-[10px] text-forest-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tab bar ─── */}
      <div className="flex bg-cream-100 mx-4 rounded-2xl p-1 mb-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === id
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-forest-500 hover:text-forest-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {/* ─── Sprints Tab ─── */}
        {activeTab === 'board' && (
          <>
            {sprints.length === 0 ? (
              <div className="text-center py-16 text-forest-400 text-sm">No sprints created yet.</div>
            ) : (
              sprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  isSelected={sprint.id === selectedSprintId}
                  onSelect={() => setSelectedSprintId(sprint.id)}
                  onStart={() => startSprint(sprint.id)}
                  onComplete={() => completeSprint(sprint.id)}
                />
              ))
            )}
          </>
        )}

        {/* ─── Backlog Tab ─── */}
        {activeTab === 'backlog' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-forest-700">
                Sprint Backlog
                <span className="ml-2 font-normal text-forest-400">
                  {assignedItems.size}/{DEMO_BACKLOG.length} items assigned
                </span>
              </p>
              <span className="text-[11px] text-forest-500 font-semibold">{totalPoints} story pts</span>
            </div>
            {DEMO_BACKLOG.map((item) => (
              <BacklogItem
                key={item.id}
                item={item}
                assigned={assignedItems.has(item.id)}
                onAssign={() => setAssignedItems((prev) => new Set([...prev, item.id]))}
                onUnassign={() => {
                  const next = new Set(assignedItems);
                  next.delete(item.id);
                  setAssignedItems(next);
                }}
              />
            ))}
          </div>
        )}

        {/* ─── Burndown Tab ─── */}
        {activeTab === 'chart' && (
          <>
            {sprints.map((sprint) => (
              <div
                key={sprint.id}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  sprint.id === selectedSprintId
                    ? 'border-forest-700 bg-white shadow-sm'
                    : 'border-cream-200 bg-white hover:border-cream-300'
                }`}
                onClick={() => setSelectedSprintId(sprint.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-forest-900">{sprint.name}</p>
                  <StatusBadge status={sprint.status} />
                </div>
                {sprint.id === selectedSprintId && <BurndownChart sprint={sprint} />}
                {sprint.id !== selectedSprintId && (
                  <div className="flex items-center justify-end mt-1">
                    <span className="text-[11px] text-forest-400 flex items-center gap-1">
                      View chart <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
