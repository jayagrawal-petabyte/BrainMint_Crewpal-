import { useState } from 'react';
import { MoreHorizontal, Plus, Calendar, Pin, Flag, GripVertical } from 'lucide-react';
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
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      {STATUS_COLUMNS.map((col) => {
        const colTasks = getColumnTasks(col.key);
        const isDropTarget = dragOverCol === col.key;

        return (
          <div
            key={col.key}
            className={`flex-1 min-w-[260px] rounded-xl p-3 border transition-all ${col.bg} ${
              isDropTarget ? 'ring-2 ring-forest-500 kanban-drop-active' : 'border-transparent'
            }`}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(col.key)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#0b170e] uppercase tracking-wider">{col.label}</span>
                <span className="bg-[#0b170e]/10 text-[#0b170e] text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {colTasks.length}
                </span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#0b170e] opacity-50" />
            </div>

            {/* Cards */}
            <div className="space-y-2.5">
              {colTasks.map((task, idx) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  index={idx}
                  isDragging={draggedId === task.id}
                  onDragStart={() => handleDragStart(task.id)}
                  onClick={() => onSelectTask(task.id)}
                  onClickMore={() => onClickMore(task.id)}
                />
              ))}

              {colTasks.length === 0 && (
                <div className="py-8 text-center text-[11px] text-[#426348]/60 font-medium rounded-xl border-2 border-dashed border-[#0b170e]/10">
                  Drop tasks here
                </div>
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
  index: number;
  isDragging: boolean;
  onDragStart: () => void;
  onClick: () => void;
  onClickMore: () => void;
}

const KanbanCard = ({ task, index, isDragging, onDragStart, onClick, onClickMore }: KanbanCardProps) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`kanban-card bg-[#fdf8e8] border border-[#0b170e] rounded-xl p-3 cursor-pointer card-animate ${
        isDragging ? 'opacity-40 scale-95' : ''
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Drag handle + Tech Tag */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3 h-3 text-[#0b170e]/30 cursor-grab" />
          <p className="text-[10px] text-[#426348] font-medium">{task.techTag}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-olive-500' : 'bg-cream-300'
        }`} />
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-[#0b170e] leading-snug mb-2">{task.title}</h4>

      {/* Assignees */}
      <div className="flex items-center -space-x-1 mb-2">
        {task.assignees.slice(0, 3).map((a) => (
          <div
            key={a.id}
            title={a.name}
            className="w-5 h-5 rounded-full border border-[#0b170e] bg-cream-50 flex items-center justify-center text-[8px] font-bold text-[#0b170e]"
          >
            {a.initials}
          </div>
        ))}
        {task.assignees.length > 3 && (
          <div className="w-5 h-5 rounded-full border border-[#0b170e] bg-cream-200 flex items-center justify-center text-[7px] font-bold">
            +{task.assignees.length - 3}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[#0b170e]">
        <div className="flex items-center gap-2">
          <Plus className="w-3 h-3" />
          <Calendar className="w-3 h-3" />
          <Pin className="w-3 h-3" />
          <Flag className="w-3 h-3" />
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClickMore(); }}>
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
