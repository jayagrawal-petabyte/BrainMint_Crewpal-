import { useMemo, useRef, useState } from 'react';
import { MoreHorizontal, Plus, Calendar, Pin, Flag, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../store/tasks';
import { useActivityStore } from '../../store/tasks/activityStore';
import type { Task, TaskStatus } from '../../types/task';

// ─── Kanban Board View (Day 19) ─────────────────────────────────────────────

const STATUS_COLUMNS: { key: TaskStatus; label: string; bg: string; headerBg: string }[] = [
  { key: 'on_track', label: 'ON TRACK', bg: 'bg-[#d4d9b8]', headerBg: 'bg-olive-300' },
  { key: 'delayed', label: 'DELAYED', bg: 'bg-[#f2cece]', headerBg: 'bg-rose-300' },
  { key: 'completed', label: 'COMPLETED', bg: 'bg-[#e2d3bc]', headerBg: 'bg-cream-300' },
];

interface KanbanBoardProps {
  onSelectTask: (id: string) => void;
  onClickMore: (id: string) => void;
}

export const KanbanBoard = ({ onSelectTask, onClickMore }: KanbanBoardProps) => {
  const tasks = useTaskStore((s) => s.tasks);
  const filter = useTaskStore((s) => ({
    search: s.filter.search,
    status: s.filter.status,
    priority: s.filter.priority,
    sortBy: s.sortBy,
    sortOrder: s.sortOrder,
  }));
  const updateStatus = useTaskStore((s) => s.updateStatus);
  const logEvent = useActivityStore((s) => s.logEvent);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const isDraggingRef = useRef(false);

  const visibleTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        filter.search.trim() === '' ||
        task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.techTag.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filter.search.toLowerCase());
      const matchesStatus = filter.status === 'all' || task.status === filter.status;
      const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered = [...filtered].sort((a, b) => {
      const priorityRank = { high: 3, medium: 2, low: 1 };
      let comparison = 0;
      switch (filter.sortBy) {
        case 'name': comparison = a.title.localeCompare(b.title); break;
        case 'dueDate': comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); break;
        case 'priority': comparison = priorityRank[b.priority] - priorityRank[a.priority]; break;
        case 'createdAt': comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
      }
      return filter.sortOrder === 'asc' ? comparison : -comparison;
    });
    return filtered;
  }, [tasks, filter]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    isDraggingRef.current = true;
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
    // Brief timeout to avoid triggering click on drag release
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handleDragOver = (e: React.DragEvent, colStatus: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colStatus) {
      setDragOverCol(colStatus);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, colStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedId;
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== colStatus) {
        updateStatus(taskId, colStatus);
        const fromLabel = task.status.replace('_', ' ').toUpperCase();
        const toLabel = colStatus.replace('_', ' ').toUpperCase();
        logEvent(taskId, 'status_changed', 'You', 'ME', `Moved task "${task.title}" from ${fromLabel} to ${toLabel}`);
      }
    }
    setDraggedId(null);
    setDragOverCol(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const getColumnTasks = (status: TaskStatus) =>
    visibleTasks.filter((t) => t.status === status);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar min-h-[600px]">
      {STATUS_COLUMNS.map((col) => {
        const colTasks = getColumnTasks(col.key);
        const isDropTarget = dragOverCol === col.key;

        return (
          <div
            key={col.key}
            className={`flex-1 min-w-[280px] rounded-xl p-3 border transition-all duration-300 ${col.bg} ${isDropTarget ? 'ring-2 ring-forest-500 kanban-drop-active shadow-inner bg-opacity-80' : 'border-transparent'
              }`}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#0b170e] uppercase tracking-wider">{col.label}</span>
                <span className="bg-[#0b170e]/10 text-[#0b170e] text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {colTasks.length}
                </span>
              </div>
              <button aria-label="Column Options" className="p-1 hover:bg-[#0b170e]/10 rounded-md transition-colors">
                <MoreHorizontal className="w-4 h-4 text-[#0b170e] opacity-70" />
              </button>
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[100px]">
              <AnimatePresence mode="popLayout">
                {colTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    isDragging={draggedId === task.id}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      if (!isDraggingRef.current) {
                        onSelectTask(task.id);
                      }
                    }}
                    onClickMore={() => onClickMore(task.id)}
                  />
                ))}
              </AnimatePresence>

              {colTasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-10 text-center text-[12px] text-[#426348]/60 font-medium rounded-xl border-2 border-dashed border-[#0b170e]/10"
                >
                  Drop tasks here
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Kanban Card ─────────────────────────────────────────────────────────────

interface KanbanCardProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onClick: () => void;
  onClickMore: () => void;
}

const KanbanCard = ({ task, isDragging, onDragStart, onDragEnd, onClick, onClickMore }: KanbanCardProps) => {
  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={onDragStart as any}
      onDragEnd={onDragEnd as any}
      onClick={onClick}
      className={`kanban-card bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-lg transition-all ${isDragging ? 'opacity-40 scale-95 shadow-none' : ''
        }`}
    >
      {/* Drag handle + Tech Tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 hover:bg-[#0b170e]/10 rounded cursor-grab active:cursor-grabbing transition-colors">
            <GripVertical className="w-3.5 h-3.5 text-[#0b170e]/40" />
          </div>
          <p className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#0b170e]/5 text-[#426348] font-semibold">{task.techTag}</p>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-olive-500' : 'bg-cream-300'
          }`} />
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-[#0b170e] leading-snug mb-3">{task.title}</h4>

      {/* Assignees */}
      <div className="flex items-center -space-x-1.5 mb-3">
        {task.assignees.slice(0, 3).map((a) => (
          <div
            key={a.id}
            title={a.name}
            className="w-6 h-6 rounded-full border-2 border-[#fdf8e8] bg-olive-200 flex items-center justify-center text-[9px] font-bold text-[#0b170e] shadow-sm relative z-10"
          >
            {a.initials}
          </div>
        ))}
        {task.assignees.length > 3 && (
          <div className="w-6 h-6 rounded-full border-2 border-[#fdf8e8] bg-cream-200 flex items-center justify-center text-[8px] font-bold shadow-sm relative z-0">
            +{task.assignees.length - 3}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[#0b170e] pt-2 border-t border-[#0b170e]/5">
        <div className="flex items-center gap-3">
          <div className="p-1 hover:bg-[#0b170e]/10 rounded transition-colors"><Plus className="w-3.5 h-3.5 opacity-70" /></div>
          <div className="p-1 hover:bg-[#0b170e]/10 rounded transition-colors"><Calendar className="w-3.5 h-3.5 opacity-70" /></div>
          <div className="p-1 hover:bg-[#0b170e]/10 rounded transition-colors"><Pin className="w-3.5 h-3.5 opacity-70" /></div>
          <div className="p-1 hover:bg-[#0b170e]/10 rounded transition-colors"><Flag className="w-3.5 h-3.5 opacity-70" /></div>
        </div>
        <button aria-label="More Options" onClick={(e) => { e.stopPropagation(); onClickMore(); }} className="p-1 hover:bg-[#0b170e]/10 rounded transition-colors">
          <MoreHorizontal className="w-4 h-4 opacity-70" />
        </button>
      </div>
    </motion.div>
  );
};

