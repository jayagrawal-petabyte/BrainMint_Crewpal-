import { useState } from 'react';
import { Plus, MoreHorizontal, Search, ChevronDown } from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { TaskCard } from '../../components/cards/TaskCard';
import type { Task, TaskStatus } from '../../types/task';

// ─── Status Group Config ───────────────────────────────────────────────────

const STATUS_GROUPS: { status: TaskStatus; label: string; bgColor: string; textColor: string; cardBorder: string }[] = [
  {
    status: 'on_track',
    label: 'ON TRACK',
    bgColor: 'bg-olive-200',
    textColor: 'text-forest-900',
    cardBorder: 'border-olive-300',
  },
  {
    status: 'delayed',
    label: 'DELAYED',
    bgColor: 'bg-rose-200',
    textColor: 'text-rose-900',
    cardBorder: 'border-rose-300',
  },
  {
    status: 'completed',
    label: 'COMPLETED',
    bgColor: 'bg-cream-200',
    textColor: 'text-forest-700',
    cardBorder: 'border-cream-300',
  },
];

// ─── Status Group Section ──────────────────────────────────────────────────

interface StatusGroupProps {
  label: string;
  bgColor: string;
  textColor: string;
  cardBorder: string;
  tasks: Task[];
  onClickCard?: (taskId: string) => void;
  onClickMore?: (taskId: string) => void;
}

const StatusGroup = ({ label, bgColor, textColor, cardBorder, tasks, onClickCard, onClickMore }: StatusGroupProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Group Header */}
      <div className={`${bgColor} rounded-xl px-4 py-3 flex items-center justify-between`}>
        <span className={`text-sm font-bold tracking-wide ${textColor}`}>{label}</span>
        <button className={`${textColor} opacity-60 hover:opacity-100 transition-opacity`}>
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            cardBorder={cardBorder}
            onClickCard={onClickCard}
            onClickMore={onClickMore}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Tasks Page ───────────────────────────────────────────────────────────

export const Tasks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const setSearch = useTaskStore((state) => state.setSearch);
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const getTaskById = useTaskStore((state) => state.getTaskById);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setSearch(value);
  };

  const handleClickCard = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleBack = () => {
    setSelectedTaskId(null);
  };

  const filteredTasks = getFilteredTasks();
  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : null;

  // Group tasks by status
  const groupedTasks = STATUS_GROUPS.reduce<Record<TaskStatus, Task[]>>(
    (acc, group) => {
      acc[group.status] = filteredTasks.filter((t) => t.status === group.status);
      return acc;
    },
    { on_track: [], delayed: [], completed: [] }
  );

  const totalCount = filteredTasks.length;

  // ─── Task Detail View ─────────────────────────────────────────────────

  if (selectedTask) {
    const statusLabel = selectedTask.status.replace('_', ' ').toUpperCase();
    const statusBg =
      selectedTask.status === 'on_track' ? 'bg-olive-200' :
      selectedTask.status === 'delayed' ? 'bg-rose-200' : 'bg-cream-200';

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-forest-900">
            Tasks{' '}
            <span className="text-sm font-semibold bg-forest-700 text-white rounded-full px-2 py-0.5 ml-1">
              {totalCount}
            </span>
          </h1>
        </div>

        {/* Search + New Task (same as list view) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-rose-100 hover:bg-rose-200/60 transition-colors rounded-full px-4 py-2.5 flex-1 min-w-0">
            <Search className="w-4 h-4 text-forest-500 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter task name"
              className="bg-transparent text-sm text-forest-800 placeholder:text-forest-400 outline-none flex-1 min-w-0"
            />
            <ChevronDown className="w-4 h-4 text-forest-500 shrink-0" />
          </div>
          <button className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-full shrink-0 shadow-sm">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-rose-200 hover:bg-rose-300 text-forest-800 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          Back
        </button>

        {/* Detail Card */}
        <div className={`${statusBg} rounded-2xl p-5 space-y-4`}>
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tracking-wide text-forest-900">{statusLabel}</span>
            <button className="text-forest-700 opacity-60 hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Expanded Task Card */}
          <div className="bg-cream-50 rounded-xl border border-forest-300 p-5 space-y-4">
            {/* Tech Tag + Title Row */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-forest-500">{selectedTask.techTag}</p>
                <h2 className="text-lg font-bold text-forest-900">{selectedTask.title}</h2>
              </div>
              <div className="flex items-center gap-3 text-forest-400">
                <Plus className="w-4 h-4 hover:text-forest-700 cursor-pointer transition-colors" />
                <span className="hover:text-forest-700 cursor-pointer transition-colors">📅</span>
                <span className="hover:text-forest-700 cursor-pointer transition-colors">📌</span>
                <span className="hover:text-forest-700 cursor-pointer transition-colors">🚩</span>
              </div>
            </div>

            {/* Assignee Avatars */}
            <div className="flex -space-x-2">
              {selectedTask.assignees.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  title={a.name}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-forest-800 ${a.avatarColor ?? 'bg-olive-300'}`}
                >
                  {a.initials}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="pt-4 space-y-2">
              <p className="text-sm text-forest-600 leading-relaxed">
                {selectedTask.description || (
                  <span className="text-forest-400 italic">Enter Description</span>
                )}
              </p>
              <div className="border-t border-cream-200 pt-3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Task List View ───────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-forest-900">
          Tasks{' '}
          <span className="text-sm font-semibold bg-forest-700 text-white rounded-full px-2 py-0.5 ml-1">
            {totalCount}
          </span>
        </h1>
      </div>

      {/* Search + New Task */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-rose-100 hover:bg-rose-200/60 transition-colors rounded-full px-4 py-2.5 flex-1 min-w-0">
          <Search className="w-4 h-4 text-forest-500 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter task name"
            className="bg-transparent text-sm text-forest-800 placeholder:text-forest-400 outline-none flex-1 min-w-0"
          />
          <ChevronDown className="w-4 h-4 text-forest-500 shrink-0" />
        </div>

        {/* New Task Button */}
        <button className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-full shrink-0 shadow-sm">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Task Groups */}
      <div className="space-y-6">
        {STATUS_GROUPS.map((group) => (
          <StatusGroup
            key={group.status}
            label={group.label}
            bgColor={group.bgColor}
            textColor={group.textColor}
            cardBorder={group.cardBorder}
            tasks={groupedTasks[group.status]}
            onClickCard={handleClickCard}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-4xl">📋</p>
          <p className="text-forest-700 font-semibold">No tasks found</p>
          <p className="text-forest-400 text-sm">Try adjusting your search or create a new task.</p>
        </div>
      )}
    </div>
  );
};
