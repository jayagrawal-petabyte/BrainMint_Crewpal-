import { useState, useRef, useEffect } from 'react';
import {
  Plus, Calendar, Pin, Flag, MoreHorizontal, Search, ChevronDown, Filter,
  Home, FolderKanban, Tag, Users, Image as ImageIcon, Send
} from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { CreateTaskModal } from '../../components/modals/CreateTaskModal';
import { EditTaskModal } from '../../components/modals/EditTaskModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { AssignTaskModal } from '../../components/modals/AssignTaskModal';
import { TaskActionsMenu } from '../../components/ui/TaskActionsMenu';
import type { Task, TaskStatus, TaskPriority } from '../../types/task';

// ─── Filter Dropdown Component ─────────────────────────────────────────────

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
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${
          hasActive
            ? 'bg-forest-800 text-white'
            : 'bg-rose-200 text-forest-900 hover:bg-rose-300'
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        Filter
        {hasActive && (
          <span className="w-4 h-4 bg-white text-forest-900 rounded-full text-[10px] font-bold flex items-center justify-center">
            {(statusFilter !== 'all' ? 1 : 0) + (priorityFilter !== 'all' ? 1 : 0)}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-cream-50 border border-cream-300 rounded-2xl shadow-xl z-50 p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-forest-700 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
              className="w-full px-2.5 py-2 bg-white border border-cream-300 rounded-xl text-xs text-forest-900 outline-none"
            >
              <option value="all">All Status</option>
              <option value="on_track">On Track</option>
              <option value="delayed">Delayed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-forest-700 uppercase tracking-wider">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
              className="w-full px-2.5 py-2 bg-white border border-cream-300 rounded-xl text-xs text-forest-900 outline-none"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

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

// ─── Assignee Circles matching Figma (8)(8)(8)(8) style ──────────────────

const AssigneeAvatars = ({ assignees }: { assignees: Task['assignees'] }) => (
  <div className="flex items-center -space-x-1.5">
    {assignees.slice(0, 4).map((a) => (
      <div
        key={a.id}
        title={a.name}
        className="w-6 h-6 rounded-full border border-forest-900 bg-cream-50 flex items-center justify-center text-[10px] font-bold text-forest-900 shadow-sm"
      >
        {a.initials}
      </div>
    ))}
    {assignees.length > 4 && (
      <div className="w-6 h-6 rounded-full border border-forest-900 bg-cream-200 flex items-center justify-center text-[9px] font-bold text-forest-700">
        +{assignees.length - 4}
      </div>
    )}
  </div>
);

// ─── Main Tasks Page (Exact match for Project -_ Task.jpg & Task-1.jpg) ──

export const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [actionsTaskId, setActionsTaskId] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<Task | null>(null);

  // Store bindings
  const search = useTaskStore((state) => state.filter.search);
  const filter = useTaskStore((state) => state.filter);
  const setSearch = useTaskStore((state) => state.setSearch);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
  const resetFilter = useTaskStore((state) => state.resetFilter);
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const updateTask = useTaskStore((state) => state.updateTask);
  const updateStatus = useTaskStore((state) => state.updateStatus);
  const updatePriority = useTaskStore((state) => state.updatePriority);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const assignTask = useTaskStore((state) => state.assignTask);

  const filteredTasks = getFilteredTasks();
  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : null;

  // Group tasks by status
  const onTrackTasks = filteredTasks.filter((t) => t.status === 'on_track');
  const delayedTasks = filteredTasks.filter((t) => t.status === 'delayed');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const handleClickMore = (taskId: string) => {
    const task = getTaskById(taskId);
    if (task) {
      setActionTarget(task);
      setActionsTaskId(taskId);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e1] text-[#0b170e] font-sans pb-28 px-4 pt-4 max-w-md mx-auto relative shadow-2xl">
      {/* ─── TOP HEADER ─── */}
      <div className="flex items-center justify-between py-2 mb-4">
        {/* Menu Icon */}
        <button className="p-1.5 text-[#0b170e] hover:opacity-80 transition-opacity">
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="14" height="3" rx="1.5" fill="#0b170e" />
            <rect y="7" width="22" height="3" rx="1.5" fill="#0b170e" />
            <rect y="14" width="18" height="2" rx="1" fill="#0b170e" />
          </svg>
        </button>

        {/* Center Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg border-2 border-[#0b170e] flex items-center justify-center bg-transparent">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L8 6L15 1" stroke="#0b170e" strokeWidth="2" strokeLinecap="round" />
              <rect x="1" y="1" width="14" height="10" rx="1" stroke="#0b170e" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-widest text-[#0b170e] leading-tight uppercase">CREWPAL</h1>
            <p className="text-[9px] text-[#426348] font-medium leading-none">for BrainMint Intern</p>
          </div>
        </div>

        {/* User Icon */}
        <button className="w-10 h-10 rounded-full bg-[#1e3624] text-[#f5f0e1] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      {/* ─── PAGE TITLE ─── */}
      <h2 className="text-3xl font-extrabold text-[#0b170e] mb-3 tracking-tight">Project</h2>

      {/* ─── NAVIGATION TABS ─── */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 mb-4 border-b border-[#0b170e]/10 no-scrollbar">
        <span className="text-sm font-semibold text-[#0b170e]/60 whitespace-nowrap cursor-pointer">Overview</span>
        
        <div
          onClick={() => setSelectedTaskId(null)}
          className="flex items-center gap-1.5 pb-2 border-b-2 border-[#1e3624] cursor-pointer whitespace-nowrap"
        >
          <span className="text-sm font-extrabold text-[#1e3624]">Tasks</span>
          <span className="bg-[#e7a8a8] text-[#0b170e] text-[11px] font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
            {filteredTasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pb-2 cursor-pointer whitespace-nowrap">
          <span className="text-sm font-semibold text-[#0b170e]/60">Updates</span>
          <span className="bg-[#e7a8a8] text-[#0b170e] text-[11px] font-bold rounded-full px-2 py-0.5">2</span>
        </div>

        <div className="flex items-center gap-1.5 pb-2 cursor-pointer whitespace-nowrap">
          <span className="text-sm font-semibold text-[#0b170e]/60">Meetings</span>
          <span className="bg-[#e7a8a8] text-[#0b170e] text-[11px] font-bold rounded-full px-2 py-0.5">99+</span>
        </div>

        <span className="text-sm font-semibold text-[#0b170e]/60 whitespace-nowrap cursor-pointer">Documents</span>
      </div>

      {/* ─── SEARCH & CONTROLS ROW ─── */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2 bg-[#f2cece]/60 border border-[#e7a8a8] rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-[#426348] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter task name"
            className="w-full bg-transparent text-xs text-[#0b170e] placeholder:text-[#426348]/70 outline-none font-medium"
          />
          <ChevronDown className="w-4 h-4 text-[#426348] shrink-0" />
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
          className="flex items-center gap-1.5 bg-[#1e3624] hover:bg-[#142619] text-[#f5f0e1] px-4 py-2 rounded-full text-xs font-bold shrink-0 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          New Task
        </button>
      </div>

      {/* ─── CONDITIONAL RENDER: LIST VIEW OR DETAIL VIEW ─── */}
      {selectedTask ? (
        /* ─── EXPANDED TASK DETAIL VIEW (Project -_ Task-1.jpg) ─── */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Back Button */}
          <button
            onClick={() => setSelectedTaskId(null)}
            className="bg-[#1e3624] text-[#f5f0e1] px-5 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            Back
          </button>

          {/* Section Container */}
          <div className="bg-[#d4d9b8] rounded-xl p-3 border border-[#b8c094]/60 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0b170e] uppercase tracking-wider">
                {selectedTask.status.replace('_', ' ')}
              </span>
              <button
                onClick={() => handleClickMore(selectedTask.id)}
                className="text-[#0b170e] opacity-70 hover:opacity-100"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Expanded Card */}
            <div className="bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 space-y-3">
              {/* Tech tag + Action icons top right */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-[#426348] font-medium">{selectedTask.techTag}</p>
                  <h3 className="text-base font-bold text-[#0b170e] leading-snug mt-0.5">{selectedTask.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-[#0b170e] pt-1">
                  <button onClick={() => setShowCreateModal(true)} title="Add subtask"><Plus className="w-4 h-4" /></button>
                  <button onClick={() => setShowEditModal(true)} title="Calendar"><Calendar className="w-4 h-4" /></button>
                  <button onClick={() => setShowAssignModal(true)} title="Pin"><Pin className="w-4 h-4" /></button>
                  <button onClick={() => setShowDeleteModal(true)} title="Flag"><Flag className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Assignee circles */}
              <AssigneeAvatars assignees={selectedTask.assignees} />

              {/* Editable Description area with underline */}
              <div className="pt-4 space-y-2">
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => updateTask(selectedTask.id, { description: e.target.value })}
                  placeholder="Enter Description"
                  rows={4}
                  className="w-full bg-transparent text-xs text-[#0b170e] placeholder:text-[#426348]/70 outline-none resize-none"
                />
                <div className="border-b border-[#0b170e]/80 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ─── VERTICAL TASK LIST VIEW (Project -_ Task.jpg) ─── */
        <div className="space-y-4">
          {/* SECTION 1: ON TRACK */}
          <div className="bg-[#d4d9b8] rounded-xl p-3 border border-[#b8c094]/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0b170e] uppercase tracking-wider">ON TRACK</span>
              <MoreHorizontal className="w-5 h-5 text-[#0b170e] opacity-70 cursor-pointer" />
            </div>

            <div className="space-y-3">
              {onTrackTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <p className="text-[11px] text-[#426348] font-medium">{task.techTag}</p>
                  <h4 className="text-sm font-bold text-[#0b170e] leading-snug">{task.title}</h4>
                  
                  <AssigneeAvatars assignees={task.assignees} />

                  <div className="flex items-center justify-between pt-1 text-[#0b170e]">
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); }}><Plus className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Calendar className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Pin className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Flag className="w-4 h-4" /></button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickMore(task.id);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-[#0b170e]/20 my-2"></div>

          {/* SECTION 2: DELAYED */}
          <div className="bg-[#f2cece] rounded-xl p-3 border border-[#e7a8a8]/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0b170e] uppercase tracking-wider">DELAYED</span>
              <MoreHorizontal className="w-5 h-5 text-[#0b170e] opacity-70 cursor-pointer" />
            </div>

            <div className="space-y-3">
              {delayedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <p className="text-[11px] text-[#426348] font-medium">{task.techTag}</p>
                  <h4 className="text-sm font-bold text-[#0b170e] leading-snug">{task.title}</h4>
                  
                  <AssigneeAvatars assignees={task.assignees} />

                  <div className="flex items-center justify-between pt-1 text-[#0b170e]">
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); }}><Plus className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Calendar className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Pin className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Flag className="w-4 h-4" /></button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickMore(task.id);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-[#0b170e]/20 my-2"></div>

          {/* SECTION 3: COMPLETED */}
          <div className="bg-[#e2d3bc] rounded-xl p-3 border border-[#ede4b8]/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0b170e] uppercase tracking-wider">COMPLETED</span>
              <MoreHorizontal className="w-5 h-5 text-[#0b170e] opacity-70 cursor-pointer" />
            </div>

            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <p className="text-[11px] text-[#426348] font-medium">{task.techTag}</p>
                  <h4 className="text-sm font-bold text-[#0b170e] leading-snug">{task.title}</h4>
                  
                  <AssigneeAvatars assignees={task.assignees} />

                  <div className="flex items-center justify-between pt-1 text-[#0b170e]">
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); }}><Plus className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Calendar className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Pin className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); }}><Flag className="w-4 h-4" /></button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickMore(task.id);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── FLOATING BOTTOM NAVIGATION BAR (Exact match for Figma design) ─── */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1e3624] text-[#f5f0e1] px-5 py-3 rounded-full flex items-center gap-5 shadow-2xl z-40 border border-[#0b170e]/40">
        <button className="hover:opacity-80 transition-opacity p-1">
          <Home className="w-5 h-5 text-[#f5f0e1]" />
        </button>

        <button className="w-9 h-9 rounded-full bg-[#d4a0a0] flex items-center justify-center shadow-inner">
          <FolderKanban className="w-5 h-5 text-[#0b170e]" />
        </button>

        <button className="hover:opacity-80 transition-opacity p-1">
          <Tag className="w-5 h-5 text-[#f5f0e1]" />
        </button>

        <button className="hover:opacity-80 transition-opacity p-1">
          <Users className="w-5 h-5 text-[#f5f0e1]" />
        </button>

        <button className="hover:opacity-80 transition-opacity p-1">
          <ImageIcon className="w-5 h-5 text-[#f5f0e1]" />
        </button>

        <button className="hover:opacity-80 transition-opacity p-1">
          <Send className="w-5 h-5 text-[#f5f0e1]" />
        </button>
      </div>

      {/* Modals */}
      <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      {actionTarget && (
        <>
          <TaskActionsMenu
            isOpen={actionsTaskId !== null}
            onClose={() => { setActionsTaskId(null); setActionTarget(null); }}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
            onAssign={() => setShowAssignModal(true)}
            onChangeStatus={(s) => updateStatus(actionTarget.id, s)}
            onChangePriority={(p) => updatePriority(actionTarget.id, p)}
            currentStatus={actionTarget.status}
            currentPriority={actionTarget.priority}
          />
          <EditTaskModal
            isOpen={showEditModal}
            onClose={() => { setShowEditModal(false); setActionTarget(null); }}
            task={actionTarget}
          />
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => { setShowDeleteModal(false); setActionTarget(null); }}
            taskTitle={actionTarget.title}
            onConfirm={() => deleteTask(actionTarget.id)}
          />
          <AssignTaskModal
            isOpen={showAssignModal}
            onClose={() => { setShowAssignModal(false); setActionTarget(null); }}
            currentAssignees={actionTarget.assignees}
            onSave={(assignees) => assignTask(actionTarget.id, assignees)}
          />
        </>
      )}

      {selectedTask && (
        <>
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
        </>
      )}
    </div>
  );
};
