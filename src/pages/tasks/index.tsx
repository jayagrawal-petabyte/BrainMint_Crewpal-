import { useState, useRef, useEffect } from 'react';
import {
  Plus, Calendar, Pin, Flag, MoreHorizontal, Search, ChevronDown, Filter,
  LayoutGrid, MessageSquare, CheckSquare, Trash2, LayoutList, Send,
  Paperclip, FileText, X, Image, Eye
} from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { CreateTaskModal } from '../../components/modals/CreateTaskModal';
import { EditTaskModal } from '../../components/modals/EditTaskModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { AssignTaskModal } from '../../components/modals/AssignTaskModal';
import { TaskActionsMenu } from '../../components/ui/TaskActionsMenu';
import { SortDropdown } from '../../components/ui/SortDropdown';
import { KanbanBoard } from '../../components/views/KanbanBoard';
import { CalendarView } from '../../components/views/CalendarView';
import { BottomNav } from '../../components/layout/BottomNav';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../hooks/useToast';
import { ActivityTimeline } from '../../components/ui/ActivityTimeline';
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

  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  
  // Day 27: Search Debounce
  const [localSearch, setLocalSearch] = useState('');

  // Store bindings
  const search = useTaskStore((state) => state.filter.search);
  const filter = useTaskStore((state) => state.filter);
  const viewMode = useTaskStore((state) => state.viewMode);
  const setViewMode = useTaskStore((state) => state.setViewMode);
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
  const addComment = useTaskStore((state) => state.addComment);
  const addSubtask = useTaskStore((state) => state.addSubtask);
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask);
  const deleteSubtask = useTaskStore((state) => state.deleteSubtask);
  const addAttachment = useTaskStore((state) => state.addAttachment);
  const deleteAttachment = useTaskStore((state) => state.deleteAttachment);
  
  // Local state for attachment preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  const filteredTasks = getFilteredTasks();
  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : null;

  // Day 27: Initialize local search and debounce
  useEffect(() => {
    setLocalSearch(search);
  }, []); // Only on mount

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

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
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="flex-1 flex items-center gap-2 bg-[#f2cece]/60 border border-[#e7a8a8] rounded-full px-3.5 py-2">
            <Search className="w-4 h-4 text-[#426348] shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search task"
              className="w-full bg-transparent text-xs text-[#0b170e] placeholder:text-[#426348]/70 outline-none font-medium"
              aria-label="Search tasks"
            />
            <ChevronDown className="w-4 h-4 text-[#426348] shrink-0" />
          </div>

          {/* New Task Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-[#1e3624] hover:bg-[#142619] text-[#f5f0e1] px-4 py-2 rounded-full text-xs font-bold shrink-0 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <FilterDropdown
              statusFilter={filter.status}
              priorityFilter={filter.priority}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onReset={resetFilter}
            />
            {/* Sort Dropdown */}
            <SortDropdown />
          </div>

          <div className="flex items-center gap-1 bg-cream-200 p-1 rounded-full border border-cream-300">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-forest-800 text-white shadow-sm' : 'text-forest-700 hover:bg-cream-300'}`}
              title="List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'kanban' ? 'bg-forest-800 text-white shadow-sm' : 'text-forest-700 hover:bg-cream-300'}`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'calendar' ? 'bg-forest-800 text-white shadow-sm' : 'text-forest-700 hover:bg-cream-300'}`}
              title="Calendar View"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── CONDITIONAL RENDER: LIST VIEW OR DETAIL VIEW ─── */}
      {selectedTask ? (
        <>
        {/* ─── EXPANDED TASK DETAIL VIEW (Project -_ Task-1.jpg) ─── */}
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

              {/* ─── SUBTASKS (Day 21) ─── */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-1.5 text-[#0b170e]">
                  <CheckSquare className="w-4 h-4" />
                  <h4 className="text-xs font-bold">Subtasks</h4>
                </div>
                
                <div className="space-y-2">
                  {selectedTask.subtasks.map((st) => (
                    <div key={st.id} className="flex items-center justify-between group">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            st.completed ? 'bg-forest-700 border-forest-700' : 'border-forest-900/40 bg-white'
                          }`}
                        >
                          {st.completed && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => toggleSubtask(selectedTask.id, st.id)}
                          className="hidden"
                        />
                        <span className={`text-xs ${st.completed ? 'text-forest-900/50 line-through' : 'text-forest-900'} transition-all`}>
                          {st.title}
                        </span>
                      </label>
                      <button
                        onClick={() => deleteSubtask(selectedTask.id, st.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-100 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newSubtask.trim()) {
                          addSubtask(selectedTask.id, newSubtask.trim());
                          setNewSubtask('');
                        }
                      }}
                      placeholder="Add new subtask..."
                      className="flex-1 bg-transparent border-b border-forest-900/20 text-xs text-forest-900 placeholder:text-forest-900/50 outline-none pb-1"
                    />
                    <button
                      onClick={() => {
                        if (newSubtask.trim()) {
                          addSubtask(selectedTask.id, newSubtask.trim());
                          setNewSubtask('');
                        }
                      }}
                      className="p-1 bg-forest-200 text-forest-800 rounded hover:bg-forest-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── ATTACHMENTS (Day 22: File Upload & Attachment Preview) ─── */}
              <div className="pt-3 space-y-3 border-t border-[#0b170e]/10 pt-3">
                <div className="flex items-center justify-between text-[#0b170e]">
                  <div className="flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4" />
                    <h4 className="text-xs font-bold">Attachments</h4>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-bold text-forest-800 bg-forest-100 hover:bg-forest-200 transition-colors px-2 py-1 rounded-full cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-2.5 h-2.5" /> Add File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Mock local object URL for preview
                        const url = URL.createObjectURL(file);
                        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                        addAttachment(
                          selectedTask.id,
                          file.name,
                          file.type,
                          `${sizeMB} MB`,
                          url
                        );
                        toast.show('File uploaded successfully', 'success');
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Attachments List */}
                <div className="grid grid-cols-1 gap-2">
                  {selectedTask.attachments && selectedTask.attachments.map((att) => {
                    const isImage = att.type.startsWith('image/');
                    return (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2 bg-white/40 hover:bg-white/70 border border-forest-900/10 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center text-forest-750 shrink-0 border border-cream-300">
                            {isImage ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-forest-900 truncate" title={att.name}>
                              {att.name}
                            </p>
                            <p className="text-[10px] text-forest-500">{att.size}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {isImage && (
                            <button
                              onClick={() => {
                                setPreviewUrl(att.url);
                                setPreviewName(att.name);
                              }}
                              className="p-1 text-forest-700 hover:bg-cream-200 rounded transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              deleteAttachment(selectedTask.id, att.id);
                              toast.show('Attachment deleted', 'info');
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-100 rounded transition-colors"
                            title="Delete"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {(!selectedTask.attachments || selectedTask.attachments.length === 0) && (
                    <p className="text-[10px] text-forest-950/40 italic py-1">No attachments uploaded.</p>
                  )}
                </div>
              </div>

              {/* ─── COMMENTS (Day 20) ─── */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[#0b170e]">
                  <MessageSquare className="w-4 h-4" />
                  <h4 className="text-xs font-bold">Comments</h4>
                </div>
                
                <div className="space-y-3 max-h-40 overflow-y-auto pr-1 no-scrollbar">
                  {selectedTask.comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-6 h-6 shrink-0 rounded-full bg-olive-200 text-forest-800 flex items-center justify-center text-[10px] font-bold">
                        {c.authorInitials}
                      </div>
                      <div className="flex-1 bg-white/50 rounded-xl rounded-tl-none p-2.5 text-xs text-forest-900 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{c.authorName}</span>
                          <span className="text-[9px] opacity-60">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-snug">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {selectedTask.comments.length === 0 && (
                    <p className="text-[11px] text-forest-900/50 italic py-2">No comments yet. Be the first!</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-rose-200 text-forest-800 flex items-center justify-center text-[10px] font-bold">
                    HG
                  </div>
                  <div className="flex-1 flex bg-white border border-forest-900/20 rounded-full pl-3 pr-1 py-1">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          addComment(selectedTask.id, 'u2', 'Harsh Gupta', 'HG', newComment.trim());
                          setNewComment('');
                        }
                      }}
                      placeholder="Write a comment..."
                      className="flex-1 bg-transparent text-xs text-forest-900 outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newComment.trim()) {
                          addComment(selectedTask.id, 'u2', 'Harsh Gupta', 'HG', newComment.trim());
                          setNewComment('');
                        }
                      }}
                      className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center hover:bg-forest-700 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── ACTIVITY TIMELINE ─── */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[#0b170e] border-t border-[#0b170e]/10 pt-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h4 className="text-xs font-bold">Activity</h4>
                </div>
                <ActivityTimeline taskId={selectedTask.id} />
              </div>
            </div>
          </div>
        </div>

        {/* Attachment Image Preview Modal Overlay */}
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative max-w-lg w-full bg-cream-50 rounded-2xl border border-cream-200 shadow-2xl p-4 overflow-hidden flex flex-col items-center">
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setPreviewName(null);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-forest-800 shadow-md hover:scale-105 transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="text-xs font-bold text-forest-900 mb-3 truncate w-11/12 text-center">
                {previewName}
              </h4>
              <img
                src={previewUrl}
                alt={previewName || 'Preview'}
                className="max-h-[50vh] object-contain rounded-xl border border-forest-900/10 shadow"
              />
            </div>
          </div>
        )}
        </>
      ) : filteredTasks.length === 0 ? (
        /* ─── EMPTY STATE (Day 27) ─── */
        <div className="pt-20">
          <EmptyState 
            type={search ? "search" : "empty"} 
            title={search ? "No tasks found" : "Your task list is empty"} 
            description={search ? `We couldn't find anything matching "${search}"` : "Create a new task to get started on your projects."}
          />
        </div>
      ) : viewMode === 'kanban' ? (
        /* ─── KANBAN BOARD VIEW ─── */
        <div className="animate-in fade-in duration-200">
          <KanbanBoard onSelectTask={setSelectedTaskId} onClickMore={handleClickMore} />
        </div>
      ) : viewMode === 'calendar' ? (
        /* ─── CALENDAR VIEW ─── */
        <div className="animate-in fade-in duration-200 pb-10">
          <CalendarView onSelectTask={setSelectedTaskId} />
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
              {onTrackTasks.length === 0 ? (
                <EmptyState type="status" title="No tasks on track" description="Everything here is clear!" />
              ) : (
                onTrackTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900"
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${task.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTaskId(task.id);
                      }
                    }}
                  >
                    <p className="text-[11px] text-[#426348] font-medium">{task.techTag}</p>
                    <h4 className="text-sm font-bold text-[#0b170e] leading-snug">{task.title}</h4>
                    
                    <AssigneeAvatars assignees={task.assignees} />

                    <div className="flex items-center justify-between pt-1 text-[#0b170e]">
                      <div className="flex items-center gap-3">
                        <button aria-label="Add subtask" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></button>
                        <button aria-label="Schedule" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Calendar className="w-4 h-4" /></button>
                        <button aria-label="Pin" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Pin className="w-4 h-4" /></button>
                        <button aria-label="Flag priority" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Flag className="w-4 h-4" /></button>
                      </div>
                      <button
                        aria-label="More actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickMore(task.id);
                        }}
                        className="hover:bg-cream-200 p-1 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              {delayedTasks.length === 0 ? (
                <EmptyState type="status" title="No delayed tasks" description="Great job keeping up!" />
              ) : (
                delayedTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900"
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${task.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTaskId(task.id);
                      }
                    }}
                  >
                    <p className="text-[11px] text-[#426348] font-medium">{task.techTag}</p>
                    <h4 className="text-sm font-bold text-[#0b170e] leading-snug">{task.title}</h4>
                    
                    <AssigneeAvatars assignees={task.assignees} />

                    <div className="flex items-center justify-between pt-1 text-[#0b170e]">
                      <div className="flex items-center gap-3">
                        <button aria-label="Add subtask" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></button>
                        <button aria-label="Schedule" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Calendar className="w-4 h-4" /></button>
                        <button aria-label="Pin" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Pin className="w-4 h-4" /></button>
                        <button aria-label="Flag priority" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Flag className="w-4 h-4" /></button>
                      </div>
                      <button
                        aria-label="More actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickMore(task.id);
                        }}
                        className="hover:bg-cream-200 p-1 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              {completedTasks.length === 0 ? (
                <EmptyState type="status" title="No completed tasks" description="Get to work!" />
              ) : (
                completedTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900"
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${task.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTaskId(task.id);
                      }
                    }}
                  >
                    <p className="text-[11px] text-[#426348] font-medium">{task.techTag}</p>
                    <h4 className="text-sm font-bold text-[#0b170e] leading-snug">{task.title}</h4>
                    
                    <AssigneeAvatars assignees={task.assignees} />

                    <div className="flex items-center justify-between pt-1 text-[#0b170e]">
                      <div className="flex items-center gap-3">
                        <button aria-label="Add subtask" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></button>
                        <button aria-label="Schedule" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Calendar className="w-4 h-4" /></button>
                        <button aria-label="Pin" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Pin className="w-4 h-4" /></button>
                        <button aria-label="Flag priority" onClick={(e) => { e.stopPropagation(); }} className="hover:scale-110 transition-transform"><Flag className="w-4 h-4" /></button>
                      </div>
                      <button
                        aria-label="More actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickMore(task.id);
                        }}
                        className="hover:bg-cream-200 p-1 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── FLOATING BOTTOM NAVIGATION BAR ─── */}
      <BottomNav />

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
            onChangeStatus={(s) => {
              updateStatus(actionTarget.id, s);
              toast.success(`Status changed to ${s.replace('_', ' ')}`);
            }}
            onChangePriority={(p) => {
              updatePriority(actionTarget.id, p);
              toast.success(`Priority changed to ${p}`);
            }}
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
            onConfirm={() => {
              deleteTask(actionTarget.id);
              toast.success('Task deleted successfully');
            }}
          />
          <AssignTaskModal
            isOpen={showAssignModal}
            onClose={() => { setShowAssignModal(false); setActionTarget(null); }}
            currentAssignees={actionTarget.assignees}
            onSave={(assignees) => {
              assignTask(actionTarget.id, assignees);
              toast.success('Assignees updated');
            }}
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
              toast.success('Task deleted successfully');
            }}
          />
          <AssignTaskModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            currentAssignees={selectedTask.assignees}
            onSave={(assignees) => {
              assignTask(selectedTask.id, assignees);
              toast.success('Assignees updated');
            }}
          />
        </>
      )}
    </div>
  );
};
