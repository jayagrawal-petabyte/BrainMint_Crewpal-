import { useState } from 'react';
import { Plus, Calendar, Pin, Flag, MoreHorizontal, Search, ChevronDown } from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
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

// ─── Assignee Avatars ──────────────────────────────────────────────────────

const AssigneeAvatars = ({ assignees }: { assignees: Task['assignees'] }) => (
  <div className="flex -space-x-2">
    {assignees.slice(0, 4).map((a) => (
      <div
        key={a.id}
        title={a.name}
        className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-forest-800 ${a.avatarColor ?? 'bg-olive-300'}`}
      >
        {a.initials}
      </div>
    ))}
    {assignees.length > 4 && (
      <div className="w-7 h-7 rounded-full border-2 border-white bg-cream-200 flex items-center justify-center text-[10px] font-bold text-forest-600">
        +{assignees.length - 4}
      </div>
    )}
  </div>
);

// ─── Task Card ─────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  cardBorder: string;
}

const TaskCard = ({ task, cardBorder }: TaskCardProps) => (
  <div className={`bg-cream-50 rounded-xl border ${cardBorder} p-4 space-y-3`}>
    {/* Tech Tag */}
    <p className="text-xs text-forest-500">{task.techTag}</p>

    {/* Title */}
    <h3 className="text-base font-semibold text-forest-900 leading-snug">{task.title}</h3>

    {/* Assignee Avatars */}
    <AssigneeAvatars assignees={task.assignees} />

    {/* Action Icons Row */}
    <div className="flex items-center justify-between pt-1">
      <div className="flex items-center gap-4 text-forest-400">
        <button className="hover:text-forest-700 transition-colors" title="Add subtask">
          <Plus className="w-4 h-4" />
        </button>
        <button className="hover:text-forest-700 transition-colors" title="Set due date">
          <Calendar className="w-4 h-4" />
        </button>
        <button className="hover:text-forest-700 transition-colors" title="Pin task">
          <Pin className="w-4 h-4" />
        </button>
        <button className="hover:text-forest-700 transition-colors" title="Set priority">
          <Flag className="w-4 h-4" />
        </button>
      </div>
      <button className="hover:text-forest-700 transition-colors text-forest-400" title="More options">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ─── Status Group Section ──────────────────────────────────────────────────

interface StatusGroupProps {
  label: string;
  bgColor: string;
  textColor: string;
  cardBorder: string;
  tasks: Task[];
}

const StatusGroup = ({ label, bgColor, textColor, cardBorder, tasks }: StatusGroupProps) => {
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
          <TaskCard key={task.id} task={task} cardBorder={cardBorder} />
        ))}
      </div>
    </div>
  );
};

// ─── Tasks Page ───────────────────────────────────────────────────────────

export const Tasks = () => {
  const [searchInput, setSearchInput] = useState('');
  const setSearch = useTaskStore((state) => state.setSearch);
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setSearch(value);
  };

  const filteredTasks = getFilteredTasks();

  // Group tasks by status
  const groupedTasks = STATUS_GROUPS.reduce<Record<TaskStatus, Task[]>>(
    (acc, group) => {
      acc[group.status] = filteredTasks.filter((t) => t.status === group.status);
      return acc;
    },
    { on_track: [], delayed: [], completed: [] }
  );

  const totalCount = filteredTasks.length;

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
