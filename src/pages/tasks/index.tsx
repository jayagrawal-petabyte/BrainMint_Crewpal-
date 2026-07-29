import { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Search, ChevronDown, Filter, Edit3, Trash2, UserPlus } from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { TaskCard } from '../../components/cards/TaskCard';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badges';
import { CreateTaskModal } from '../../components/modals/CreateTaskModal';
import { EditTaskModal } from '../../components/modals/EditTaskModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { AssignTaskModal } from '../../components/modals/AssignTaskModal';
import { TaskActionsMenu } from '../../components/ui/TaskActionsMenu';
import type { Task, TaskStatus, TaskPriority } from '../../types/task';

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

// ─── Filter Dropdown (Day 8) ───────────────────────────────────────────────

interface FilterDropdownProps {
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  onStatusChange: (s: TaskStatus | 'all') => void;
  onPriorityChange: (p: TaskPriority | 'all') => void;
  onReset: () => void;
}

const FilterDropdown = ({ statusFilter, priorityFilter, onStatusChange, onPriorityChange, onReset }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasActive = statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-medium transition-colors ${
          hasActive
            ? 'bg-forest-700 text-white'
            : 'bg-cream-200 text-forest-700 hover:bg-cream-300'
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        Filter
        {hasActive && (
          <span className="w-4 h-4 bg-white text-forest-700 rounded-full text-[10px] font-bold flex items-center justify-center">
            {(statusFilter !== 'all' ? 1 : 0) + (priorityFilter !== 'all' ? 1 : 0)}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-cream-50 border border-cream-200 rounded-xl shadow-lg z-30 p-4 space-y-4">
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-forest-500 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
              className="w-full px-2.5 py-2 bg-white border border-cream-200 rounded-lg text-xs text-forest-800 outline-none focus:border-forest-400 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="on_track">On Track</option>
              <option value="delayed">Delayed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-forest-500 uppercase tracking-wider">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
              className="w-full px-2.5 py-2 bg-white border border-cream-200 rounded-lg text-xs text-forest-800 outline-none focus:border-forest-400 transition-colors"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Reset */}
          {hasActive && (
            <button
              onClick={() => { onReset(); setOpen(false); }}
              className="w-full text-center text-xs text-rose-600 hover:text-rose-800 font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

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
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tracking-wide ${textColor}`}>{label}</span>
          <span className={`text-xs font-semibold ${textColor} opacity-60`}>({tasks.length})</span>
        </div>
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [actionsTaskId, setActionsTaskId] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<Task | null>(null);

  const setSearch = useTaskStore((state) => state.setSearch);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
  const resetFilter = useTaskStore((state) => state.resetFilter);
  const filter = useTaskStore((state) => state.filter);
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const updateStatus = useTaskStore((state) => state.updateStatus);
  const updatePriority = useTaskStore((state) => state.updatePriority);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const assignTask = useTaskStore((state) => state.assignTask);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setSearch(value);
  };

  const handleClickCard = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleClickMore = (taskId: string) => {
    const task = getTaskById(taskId);
    if (task) {
      setActionTarget(task);
      setActionsTaskId(taskId);
    }
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

  // ─── Task Detail View (Day 9 enhanced + Day 12-16 actions) ────────────

  if (selectedTask) {
    const statusBg =
      selectedTask.status === 'on_track' ? 'bg-olive-200' :
      selectedTask.status === 'delayed' ? 'bg-rose-200' : 'bg-cream-200';

    const formattedDate = new Date(selectedTask.dueDate).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    const isOverdue = new Date(selectedTask.dueDate) < new Date() && selectedTask.status !== 'completed';

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
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-full shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Back + Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="bg-rose-200 hover:bg-rose-300 text-forest-800 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Back
          </button>
          <div className="flex-1" />
          {/* Quick Action Buttons */}
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-cream-200 hover:bg-cream-300 text-forest-700 text-xs font-medium rounded-full transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-cream-200 hover:bg-cream-300 text-forest-700 text-xs font-medium rounded-full transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> Assign
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-medium rounded-full transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>

        {/* Detail Card */}
        <div className={`${statusBg} rounded-2xl p-5 space-y-4`}>
          {/* Status Header with Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusBadge status={selectedTask.status} size="md" />
              <PriorityBadge priority={selectedTask.priority} size="md" />
            </div>
            <div className="relative">
              <button
                onClick={() => setActionsTaskId(actionsTaskId ? null : selectedTask.id)}
                className="text-forest-700 opacity-60 hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <TaskActionsMenu
                isOpen={actionsTaskId === selectedTask.id}
                onClose={() => setActionsTaskId(null)}
                onEdit={() => setShowEditModal(true)}
                onDelete={() => setShowDeleteModal(true)}
                onAssign={() => setShowAssignModal(true)}
                onChangeStatus={(s) => updateStatus(selectedTask.id, s)}
                onChangePriority={(p) => updatePriority(selectedTask.id, p)}
                currentStatus={selectedTask.status}
                currentPriority={selectedTask.priority}
              />
            </div>
          </div>

          {/* Expanded Task Card */}
          <div className="bg-cream-50 rounded-xl border border-forest-300 p-5 space-y-4">
            {/* Tech Tag + Title Row */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-forest-500">{selectedTask.techTag}</p>
                <h2 className="text-lg font-bold text-forest-900">{selectedTask.title}</h2>
              </div>
            </div>

            {/* Assignee Avatars */}
            <div className="flex -space-x-2">
              {selectedTask.assignees.slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  title={a.name}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-forest-800 ${a.avatarColor ?? 'bg-olive-300'}`}
                >
                  {a.initials}
                </div>
              ))}
              {selectedTask.assignees.length > 6 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-cream-200 flex items-center justify-center text-[10px] font-bold text-forest-600">
                  +{selectedTask.assignees.length - 6}
                </div>
              )}
            </div>

            {/* Due Date + Status Change (Day 15 — inline due date + Day 16 — inline status) */}
            <div className="flex items-center justify-between pt-2 border-t border-cream-200">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${isOverdue ? 'text-rose-600' : 'text-forest-400'}`}>
                  📅 Due: {formattedDate}
                </span>
                <input
                  type="date"
                  value={selectedTask.dueDate}
                  onChange={(e) => {
                    const store = useTaskStore.getState();
                    store.updateTask(selectedTask.id, { dueDate: e.target.value });
                  }}
                  className="text-[10px] bg-cream-200 border-none rounded-lg px-2 py-1 text-forest-600 outline-none cursor-pointer"
                />
              </div>
              <select
                value={selectedTask.status}
                onChange={(e) => updateStatus(selectedTask.id, e.target.value as TaskStatus)}
                className="text-xs font-medium bg-forest-700 text-white rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-forest-800 transition-colors"
              >
                <option value="on_track">ON TRACK</option>
                <option value="delayed">DELAYED</option>
                <option value="completed">COMPLETED</option>
              </select>
            </div>

            {/* Description */}
            <div className="pt-2 space-y-2">
              <p className="text-sm text-forest-600 leading-relaxed">
                {selectedTask.description || (
                  <span className="text-forest-400 italic">Enter Description</span>
                )}
              </p>
              <div className="border-t border-cream-200 pt-3"></div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          task={selectedTask}
        />
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          taskTitle={selectedTask.title}
          onConfirm={() => {
            deleteTask(selectedTask.id);
            setSelectedTaskId(null);
          }}
        />
        <AssignTaskModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          currentAssignees={selectedTask.assignees}
          onSave={(assignees) => assignTask(selectedTask.id, assignees)}
        />
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

      {/* Search + Filter + New Task */}
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

        {/* Filter Dropdown */}
        <FilterDropdown
          statusFilter={filter.status}
          priorityFilter={filter.priority}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onReset={resetFilter}
        />

        {/* New Task Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-full shrink-0 shadow-sm"
        >
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
            onClickMore={handleClickMore}
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

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* Actions Menu for List View ⋯ clicks */}
      {actionTarget && (
        <>
          <TaskActionsMenu
            isOpen={actionsTaskId !== null && selectedTaskId === null}
            onClose={() => { setActionsTaskId(null); setActionTarget(null); }}
            onEdit={() => { setShowEditModal(true); }}
            onDelete={() => { setShowDeleteModal(true); }}
            onAssign={() => { setShowAssignModal(true); }}
            onChangeStatus={(s) => updateStatus(actionTarget.id, s)}
            onChangePriority={(p) => updatePriority(actionTarget.id, p)}
            currentStatus={actionTarget.status}
            currentPriority={actionTarget.priority}
          />
          <EditTaskModal
            isOpen={showEditModal}
            onClose={() => { setShowEditModal(false); setActionTarget(null); setActionsTaskId(null); }}
            task={actionTarget}
          />
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => { setShowDeleteModal(false); setActionTarget(null); setActionsTaskId(null); }}
            taskTitle={actionTarget.title}
            onConfirm={() => deleteTask(actionTarget.id)}
          />
          <AssignTaskModal
            isOpen={showAssignModal}
            onClose={() => { setShowAssignModal(false); setActionTarget(null); setActionsTaskId(null); }}
            currentAssignees={actionTarget.assignees}
            onSave={(assignees) => assignTask(actionTarget.id, assignees)}
          />
        </>
      )}
    </div>
  );
};
