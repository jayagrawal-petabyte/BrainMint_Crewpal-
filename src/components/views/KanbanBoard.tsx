import { useState } from 'react';
import { MoreHorizontal, Plus, Calendar, Pin, Flag, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../store/tasks';
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
  const tasks = useTaskStore((s) => s.getFilteredTasks());
  const updateStatus = useTaskStore((s) => s.updateStatus);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(colStatus);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (colStatus: TaskStatus) => {
    if (draggedId) {
      updateStatus(draggedId, colStatus);
      setDraggedId(null);
      setDragOverCol(null);
    }
  };

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar min-h-[600px]">
      {STATUS_COLUMNS.map((col) => {
        const colTasks = getColumnTasks(col.key);
        const isDropTarget = dragOverCol === col.key;

        return (
          <div
            key={col.key}
            className={`flex-1 min-w-[280px] rounded-xl p-3 border transition-all duration-300 ${col.bg} ${
              isDropTarget ? 'ring-2 ring-forest-500 kanban-drop-active shadow-inner bg-opacity-80' : 'border-transparent'
            }`}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(col.key)}
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
                    onDragStart={() => handleDragStart(task.id)}
                    onClick={() => onSelectTask(task.id)}
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
  onDragStart: () => void;
  onClick: () => void;
  onClickMore: () => void;
}

const KanbanCard = ({ task, isDragging, onDragStart, onClick, onClickMore }: KanbanCardProps) => {
  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`kanban-card bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3.5 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all ${
        isDragging ? 'opacity-40 scale-95 shadow-none' : ''
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
        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
          task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-olive-500' : 'bg-cream-300'
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
