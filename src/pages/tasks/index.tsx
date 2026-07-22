import { useState } from 'react';
import {
  Plus, Calendar, Pin, Flag, MoreHorizontal, Search, ChevronDown,
  Menu, Bell, Settings, User,
  LayoutDashboard, KanbanSquare, Users, CalendarDays, BarChart3, MessageSquare
} from 'lucide-react';
import { useTaskStore, MOCK_TEAM_MEMBERS } from '../../store/tasks';
import type { Task, TaskStatus } from '../../types/task';

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  bgColor: string;
  tasks: Task[];
  activeDragOverColumn: TaskStatus | null;
  draggedTaskId: string | null;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onCardClick: (id: string) => void;
  onCyclePriority: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  onAddCard: (status: TaskStatus) => void;
}

const KanbanColumn = ({
  status,
  label,
  bgColor,
  tasks,
  activeDragOverColumn,
  draggedTaskId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardClick,
  onCyclePriority,
  onToggleStatus,
  onAddCard,
}: KanbanColumnProps) => {
  const isDragOver = activeDragOverColumn === status;

  return (
    <div
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
      className={`w-[299px] p-3 flex flex-col gap-3 rounded-2xl transition-all duration-200 border-2 ${bgColor} ${
        isDragOver
          ? `border-dashed border-Dark-Green scale-[1.01] shadow-lg kanban-drop-active`
          : 'border-transparent'
      }`}
    >
      {/* Column Header */}
      <div className="self-stretch inline-flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <span className="text-zinc-800 text-base font-bold font-['Roboto'] leading-6 tracking-wide">
            {label}
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold bg-Dark-Green/10 text-Dark-Green rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="size-6 relative overflow-hidden flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5 text-zinc-500" />
        </div>
      </div>

      {/* Column Divider */}
      <div className="w-full h-px bg-zinc-400/20" />

      {/* Cards Scrollable Area */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 custom-scrollbar min-h-[150px]">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const isDragging = draggedTaskId === task.id;
            return (
              <div
                key={task.id}
                draggable={true}
                onDragStart={(e) => onDragStart(e, task.id)}
                onDragEnd={onDragEnd}
                onClick={() => onCardClick(task.id)}
                className={`kanban-card self-stretch p-3 bg-Pink-Beige outline outline-1 outline-offset-[-1px] outline-Midnight-Green flex flex-col justify-start items-start gap-2 rounded-xl cursor-grab hover:shadow-md transition-all duration-200 ${
                  isDragging ? 'opacity-40 scale-[0.98] cursor-grabbing shadow-inner' : 'opacity-100 hover:scale-[1.01]'
                } ${task.status === 'completed' ? 'opacity-85' : ''} group`}
              >
                <div className="self-stretch justify-start text-zinc-800 text-xs font-normal font-['Roboto'] leading-4">
                  {task.techTag}
                </div>
                <div
                  className={`self-stretch justify-start text-zinc-800 text-base font-semibold font-['Roboto'] leading-6 group-hover:text-Dark-Green transition-colors ${
                    task.status === 'completed' ? 'line-through decoration-zinc-500' : ''
                  }`}
                >
                  {task.title}
                </div>
                <div className="self-stretch flex items-center justify-between mt-0.5">
                  <div className="size- inline-flex justify-start items-start">
                    {task.assignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        title={assignee.name}
                        className={`w-6 h-6 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-Midnight-Green flex justify-center items-center text-[9px] font-bold text-Dark-Green ${
                          assignee.avatarColor ?? 'bg-Rosy-brown'
                        } -ml-1.5 first:ml-0 shadow-sm`}
                      >
                        {assignee.initials}
                      </div>
                    ))}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full priority-${task.priority}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <div className="self-stretch inline-flex justify-between items-center pt-2 border-t border-zinc-200/50 mt-1">
                  <div className="size- flex justify-start items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform"
                      title="Add subtask"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform"
                      title="Set due date"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform"
                      title="Pin task"
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onCyclePriority(task)}
                      className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform"
                      title={`Priority: ${task.priority} (Click to cycle)`}
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(task);
                    }}
                    className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform"
                    title={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 bg-Pink-Beige/20 border border-dashed border-zinc-400/30 rounded-xl text-center text-xs text-zinc-500 font-['Roboto'] italic min-h-[120px]">
            Drag tasks here
          </div>
        )}
      </div>

      {/* Column Footer – Add card */}
      <button
        onClick={() => onAddCard(status)}
        className="w-full mt-1 flex items-center gap-2 px-2 py-2 rounded-xl text-xs font-medium text-Dark-Green/60 hover:text-Dark-Green hover:bg-Dark-Green/10 transition-all duration-150 group"
      >
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Add card
      </button>
    </div>
  );
};

export const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDragOverColumn, setActiveDragOverColumn] = useState<TaskStatus | null>(null);

  // Zustand store hook bindings
  const search = useTaskStore((state) => state.filter.search);
  const setSearch = useTaskStore((state) => state.setSearch);
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const addTask = useTaskStore((state) => state.addTask);
  const allTasks = useTaskStore((state) => state.tasks);

  const filteredTasks = getFilteredTasks();
  const selectedTask = selectedTaskId ? allTasks.find((t) => t.id === selectedTaskId) : null;

  // Filter tasks into columns
  const onTrackTasks = filteredTasks.filter((t) => t.status === 'on_track');
  const delayedTasks = filteredTasks.filter((t) => t.status === 'delayed');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  // Handle adding a new task
  const handleAddTask = () => {
    if (!search.trim()) return;
    addTask({
      title: search.trim(),
      description: '',
      techTag: 'React + Node',
      status: 'on_track',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignees: [MOCK_TEAM_MEMBERS[0], MOCK_TEAM_MEMBERS[1]],
    });
    setSearch('');
  };

  // Status section configuration helper
  const getStatusGroupDetails = (status: TaskStatus) => {
    switch (status) {
      case 'on_track':
        return {
          bgColor: 'bg-Moss-Green',
          label: 'ON TRACK',
        };
      case 'delayed':
        return {
          bgColor: 'bg-red-600/20',
          label: 'DELAYED',
        };
      case 'completed':
        return {
          bgColor: 'bg-black/20',
          label: 'COMPLETED',
        };
    }
  };

  // Cycle priority for flag click action
  const handleCyclePriority = (task: Task) => {
    const priorities: Task['priority'][] = ['low', 'medium', 'high'];
    const nextIndex = (priorities.indexOf(task.priority) + 1) % priorities.length;
    updateTask(task.id, { priority: priorities[nextIndex] });
  };

  // Toggle status for complete action
  const handleToggleStatus = (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'on_track' : 'completed';
    updateTask(task.id, { status: nextStatus });
    if (selectedTaskId === task.id) {
      setSelectedTaskId(null);
    }
  };

  // Add a new card to a specific column
  const handleAddCard = (status: TaskStatus) => {
    const label = window.prompt(`New task title for ${status.replace('_', ' ')} column:`);
    if (!label?.trim()) return;
    addTask({
      title: label.trim(),
      description: '',
      techTag: 'React + Node',
      status,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignees: [MOCK_TEAM_MEMBERS[0]],
    });
  };

  // ── Drag and Drop Event Handlers ──────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedTaskId(id);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setActiveDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setActiveDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      updateTask(id, { status });
    }
    setDraggedTaskId(null);
    setActiveDragOverColumn(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-Beige">

      {/* ─── HEADER ─── */}
      <div className="mx-[57px] mt-[48px] h-20 px-4 pr-8 bg-Dark-Green rounded-[35px] flex-shrink-0 inline-flex justify-start items-center gap-8 z-20">
        {/* Menu */}
        <div className="flex justify-end items-center gap-4 flex-shrink-0">
          <div className="h-12 px-2 py-4 flex justify-center items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="size-6 flex items-center justify-center">
              <Menu className="w-5 h-5 text-Beige" />
            </div>
            <div className="text-Beige text-base font-medium font-['Roboto'] leading-4 tracking-wide">Menu</div>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-start items-center gap-2 flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="CREWPAL logo mark">
            <rect x="2" y="6" width="16" height="12" rx="3" fill="#d4a0a0" />
            <rect x="8" y="10" width="16" height="12" rx="3" fill="#faf5e4" fillOpacity="0.85" />
            <circle cx="20" cy="8" r="4" fill="#faf5e4" fillOpacity="0.6" />
          </svg>
          <div className="flex flex-col justify-center items-start">
            <div className="text-Beige text-2xl font-bold font-['Roboto'] leading-7 tracking-widest">CREWPAL</div>
            <div className="text-Beige/60 text-xs font-normal font-['Roboto'] leading-4">for BrainMint Intern</div>
          </div>
        </div>

        {/* Search bar — grows to fill available space */}
        <div className="flex-1 h-12 px-4 py-3 bg-slate-100 rounded-3xl border-b border-neutral-300 flex justify-start items-center gap-2">
          <Search className="w-5 h-5 text-zinc-500 flex-shrink-0" />
          <div className="flex-1 text-zinc-500 text-base font-normal font-['Roboto'] leading-6">Search for...</div>
        </div>

        {/* Right action icons */}
        <div className="flex justify-center items-center gap-4 flex-shrink-0">
          <div className="h-12 px-2 flex justify-center items-center cursor-pointer hover:opacity-80" title="Settings">
            <Settings className="w-5 h-5 text-Beige" />
          </div>
          <div className="h-12 px-2 relative flex justify-center items-center cursor-pointer hover:opacity-80" title="Notifications">
            <Bell className="w-5 h-5 text-Beige" />
            <div className="px-1.5 py-[0.50px] -top-0.5 -right-0.5 absolute bg-red-600 rounded-xl flex justify-center items-center">
              <div className="text-white text-xs font-normal font-['Roboto'] leading-4">9</div>
            </div>
          </div>
          <div className="size-10 bg-Beige rounded-full flex justify-center items-center cursor-pointer hover:scale-105 transition-transform" title="Profile">
            <User className="w-5 h-5 text-Dark-Green" />
          </div>
        </div>
      </div>

      {/* ─── BODY (sidebar + main) ─── */}
      <div className="flex flex-row flex-1 mt-10 gap-6 px-[43px] pb-8">

        {/* ─── SIDEBAR ─── */}
        <div className="w-64 flex-shrink-0 bg-MossGreen rounded-[40px] px-4 py-6 flex flex-col gap-1 self-start sticky top-6">
          <div className="self-stretch h-12 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-Dark-Green hover:bg-Dark-Green/5 transition-colors cursor-pointer flex items-center gap-2 px-2">
            <LayoutDashboard className="w-5 h-5 text-Dark-Green flex-shrink-0" />
            <div className="text-Dark-Green text-base font-medium font-['Roboto'] leading-4">Dashboard</div>
          </div>
          <div className="self-stretch px-2 py-3 bg-Rosy-brown rounded-[10px] border-l border-r border-Dark-Green flex justify-start items-center gap-2 cursor-pointer shadow-sm">
            <KanbanSquare className="w-5 h-5 text-Dark-Green flex-shrink-0" />
            <div className="flex-1 text-Dark-Green text-base font-medium font-['Roboto'] leading-4">Project</div>
          </div>
          <div className="self-stretch px-2 py-3 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-Dark-Green flex justify-start items-center gap-2 hover:bg-Dark-Green/5 transition-colors cursor-pointer">
            <Users className="w-5 h-5 text-Dark-Green flex-shrink-0" />
            <div className="flex-1 text-Dark-Green text-base font-medium font-['Roboto'] leading-4">Teams</div>
          </div>
          <div className="self-stretch px-2 py-3 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-Dark-Green flex justify-start items-center gap-2 hover:bg-Dark-Green/5 transition-colors cursor-pointer">
            <CalendarDays className="w-5 h-5 text-Dark-Green flex-shrink-0" />
            <div className="flex-1 text-Dark-Green text-base font-medium font-['Roboto'] leading-4">Calendar</div>
          </div>
          <div className="self-stretch px-2 py-3 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-Dark-Green flex justify-start items-center gap-2 hover:bg-Dark-Green/5 transition-colors cursor-pointer">
            <BarChart3 className="w-5 h-5 text-Dark-Green flex-shrink-0" />
            <div className="flex-1 text-Dark-Green text-base font-medium font-['Roboto'] leading-4">Reports</div>
          </div>
          <div className="self-stretch px-2 py-3 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-Dark-Green flex justify-start items-center gap-2 hover:bg-Dark-Green/5 transition-colors cursor-pointer">
            <MessageSquare className="w-5 h-5 text-Dark-Green flex-shrink-0" />
            <div className="flex-1 text-Dark-Green text-base font-medium font-['Roboto'] leading-4">Chats</div>
            <div className="px-1.5 py-[0.50px] bg-Rosy-brown rounded-xl flex justify-center items-center">
              <div className="text-Midnight-Green text-xs font-normal font-['Roboto'] leading-4">99+</div>
            </div>
            <ChevronDown className="w-4 h-4 text-Dark-Green flex-shrink-0" />
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Page title */}
          <div className="text-zinc-800 text-5xl font-bold font-['Roboto'] leading-10 mb-4">PROJECT</div>

          {/* ─── TABS ─── */}
          <div className="flex justify-between items-center border-b border-zinc-200 mb-4">
            <div className="flex justify-start items-center gap-6">
              <div className="h-12 py-4 flex justify-center items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="text-Dark-Green text-base font-medium font-['Roboto'] leading-4 tracking-wide">Overview</div>
              </div>
              <div
                onClick={() => setSelectedTaskId(null)}
                className={`h-12 py-4 flex justify-center items-center gap-2 cursor-pointer transition-colors ${
                  selectedTaskId === null ? 'border-b-[3px] border-Midnight-Green' : ''
                }`}
              >
                <div className={`text-base font-medium font-['Roboto'] leading-4 tracking-wide ${
                  selectedTaskId === null ? 'text-Midnight-Green' : 'text-Dark-Green hover:text-Midnight-Green'
                }`}>Tasks</div>
                <div className="px-1.5 py-[0.50px] bg-Rosy-brown rounded-xl flex justify-center items-center">
                  <div className="text-Midnight-Green text-xs font-normal font-['Roboto'] leading-4">{filteredTasks.length}</div>
                </div>
              </div>
              <div className="h-12 py-4 flex justify-center items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="text-Dark-Green text-base font-medium font-['Roboto'] leading-4 tracking-wide">Updates</div>
                <div className="px-1.5 py-[0.50px] bg-Rosy-brown rounded-xl flex justify-center items-center">
                  <div className="text-Dark-Green text-xs font-normal font-['Roboto'] leading-4">2</div>
                </div>
              </div>
              <div className="h-12 py-4 flex justify-center items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="text-Dark-Green text-base font-medium font-['Roboto'] leading-4 tracking-wide">Meetings</div>
                <div className="px-1.5 py-[0.50px] bg-Rosy-brown rounded-xl flex justify-center items-center">
                  <div className="text-Dark-Green text-xs font-normal font-['Roboto'] leading-4">99+</div>
                </div>
              </div>
              <div className="h-12 py-4 flex justify-center items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="text-Dark-Green text-base font-medium font-['Roboto'] leading-4 tracking-wide">Documents</div>
              </div>
              <div className="h-12 py-4 flex justify-center items-center gap-2 opacity-50 cursor-not-allowed">
                <div className="text-Dark-Green text-base font-medium font-['Roboto'] leading-4 tracking-wide">Admin</div>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-zinc-400" />
          </div>

          {/* ─── SEARCH & ADD ROW ─── */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 max-w-sm h-12 px-4 py-3 bg-Pink-Beige rounded-3xl border-b border-Rosy-brown flex justify-start items-center gap-2 focus-within:shadow-sm transition-shadow">
              <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
                placeholder={selectedTaskId ? 'Search/Filter task name' : 'Enter task name'}
                className="flex-1 bg-transparent text-Midnight-Green text-base font-normal font-['Roboto'] leading-6 outline-none placeholder:text-zinc-500"
              />
              <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            </div>
            <button
              onClick={handleAddTask}
              className="h-10 px-4 py-2 bg-Dark-Green rounded-2xl flex justify-center items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4 text-Beige" />
              <div className="text-Beige text-sm font-medium font-['Roboto'] leading-4 tracking-wide">New Task</div>
            </button>
          </div>

          {/* ─── KANBAN BOARD or EXPANDED DETAIL ─── */}
          {selectedTask === null || selectedTask === undefined ? (
            // ─── KANBAN BOARD VIEW ───
            <div className="flex flex-row gap-4 flex-1 overflow-x-auto pb-4">
              <KanbanColumn
                status="on_track"
                label="ON TRACK"
                bgColor="bg-Moss-Green bg-opacity-70"
                tasks={onTrackTasks}
                activeDragOverColumn={activeDragOverColumn}
                draggedTaskId={draggedTaskId}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onCardClick={setSelectedTaskId}
                onCyclePriority={handleCyclePriority}
                onToggleStatus={handleToggleStatus}
                onAddCard={handleAddCard}
              />
              <KanbanColumn
                status="delayed"
                label="DELAYED"
                bgColor="bg-red-600/10 bg-opacity-80"
                tasks={delayedTasks}
                activeDragOverColumn={activeDragOverColumn}
                draggedTaskId={draggedTaskId}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onCardClick={setSelectedTaskId}
                onCyclePriority={handleCyclePriority}
                onToggleStatus={handleToggleStatus}
                onAddCard={handleAddCard}
              />
              <KanbanColumn
                status="completed"
                label="COMPLETED"
                bgColor="bg-black/10 bg-opacity-85"
                tasks={completedTasks}
                activeDragOverColumn={activeDragOverColumn}
                draggedTaskId={draggedTaskId}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onCardClick={setSelectedTaskId}
                onCyclePriority={handleCyclePriority}
                onToggleStatus={handleToggleStatus}
                onAddCard={handleAddCard}
              />
            </div>
          ) : (
            // ─── DETAIL/EXPANDED VIEW ───
            <div className="flex flex-row gap-6 flex-1">
              {/* Card column */}
              <div className={`flex-1 p-3 flex flex-col gap-3 rounded-2xl ${getStatusGroupDetails(selectedTask.status)?.bgColor || 'bg-Moss-Green'}`}>
                {/* Column header */}
                <div className="flex justify-between items-center px-1">
                  <div className="text-zinc-800 text-base font-bold font-['Roboto'] leading-6 tracking-wide">
                    {getStatusGroupDetails(selectedTask.status)?.label || 'ON TRACK'}
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                </div>
                {/* Expanded card */}
                <div
                  onClick={() => setSelectedTaskId(null)}
                  className="p-3 bg-Pink-Beige outline outline-1 outline-offset-[-1px] outline-Midnight-Green flex flex-col gap-2 rounded-xl cursor-pointer hover:shadow-sm transition-shadow"
                  title="Click to close detail view"
                >
                  <div className="text-zinc-800 text-xs font-normal font-['Roboto'] leading-4">{selectedTask.techTag}</div>
                  <div className="text-zinc-800 text-base font-bold font-['Roboto'] leading-6">{selectedTask.title}</div>
                  <div className="flex items-start">
                    {selectedTask.assignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        title={assignee.name}
                        className={`w-6 h-6 rounded-full outline outline-1 outline-offset-[-1px] outline-Midnight-Green flex justify-center items-center text-[9px] font-bold text-Dark-Green ${assignee.avatarColor ?? 'bg-Rosy-brown'} -ml-1.5 first:ml-0 shadow-sm`}
                      >
                        {assignee.initials}
                      </div>
                    ))}
                  </div>
                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-auto pt-3 border-t border-zinc-200/60" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-zinc-500 font-['Roboto']">📅 {selectedTask.dueDate}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full priority-${selectedTask.priority}`}>
                      {selectedTask.priority.toUpperCase()}
                    </span>
                    <select
                      value={selectedTask.status}
                      onChange={(e) => updateTask(selectedTask.id, { status: e.target.value as TaskStatus })}
                      className="ml-auto text-xs font-medium bg-Dark-Green text-Beige rounded-lg px-2 py-1 outline-none cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <option value="on_track">ON TRACK</option>
                      <option value="delayed">DELAYED</option>
                      <option value="completed">COMPLETED</option>
                    </select>
                  </div>
                </div>

                {/* Description editor */}
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => updateTask(selectedTask.id, { description: e.target.value })}
                  placeholder="Enter Description"
                  className="flex-1 min-h-[160px] px-4 py-3 bg-Beige border-b border-Midnight-Green text-Midnight-Green text-base font-normal font-['Roboto'] leading-6 outline-none resize-none focus:border-Dark-Green transition-colors shadow-inner rounded-md"
                />
              </div>

              {/* Side action icons */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <button className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform" title="Add subtask">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform" title={`Due Date: ${selectedTask.dueDate}`}>
                  <Calendar className="w-5 h-5" />
                </button>
                <button className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform" title="Pin task">
                  <Pin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCyclePriority(selectedTask)}
                  className="size-6 flex items-center justify-center text-Dark-Green hover:scale-125 transition-transform"
                  title={`Priority: ${selectedTask.priority} (Click to cycle)`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

