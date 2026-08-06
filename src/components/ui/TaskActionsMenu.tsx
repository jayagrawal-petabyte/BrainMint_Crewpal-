import { useState, useRef, useEffect } from 'react';
import { Edit3, Trash2, UserPlus, ArrowRightLeft, Flag } from 'lucide-react';
import type { TaskStatus, TaskPriority } from '../../types/task';

// ─── Task Actions Menu (Day 16–17) ─────────────────────────────────────────

interface TaskActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onChangeStatus: (status: TaskStatus) => void;
  onChangePriority: (priority: TaskPriority) => void;
  currentStatus: TaskStatus;
  currentPriority: TaskPriority;
}

export const TaskActionsMenu = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAssign,
  onChangeStatus,
  onChangePriority,
  currentStatus,
  currentPriority,
}: TaskActionsMenuProps) => {
  const [showStatusSub, setShowStatusSub] = useState(false);
  const [showPrioritySub, setShowPrioritySub] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'on_track', label: 'On Track', color: 'bg-olive-400' },
    { value: 'delayed', label: 'Delayed', color: 'bg-rose-400' },
    { value: 'completed', label: 'Completed', color: 'bg-cream-300' },
  ];

  const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'high', label: 'High', color: 'bg-rose-500' },
    { value: 'medium', label: 'Medium', color: 'bg-olive-500' },
    { value: 'low', label: 'Low', color: 'bg-cream-300' },
  ];

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-48 bg-cream-50 border border-cream-200 rounded-xl shadow-lg z-40 py-1.5 overflow-hidden">
      {/* Edit */}
      <button
        onClick={() => { onEdit(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-forest-700 hover:bg-cream-200 transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5" /> Edit
      </button>

      {/* Assign */}
      <button
        onClick={() => { onAssign(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-forest-700 hover:bg-cream-200 transition-colors"
      >
        <UserPlus className="w-3.5 h-3.5" /> Assign
      </button>

      {/* Change Status */}
      <div className="relative">
        <button
          onClick={() => { setShowStatusSub(!showStatusSub); setShowPrioritySub(false); }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-forest-700 hover:bg-cream-200 transition-colors"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Status
        </button>
        {showStatusSub && (
          <div className="pl-8 pb-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChangeStatus(opt.value); onClose(); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors rounded-lg ${currentStatus === opt.value ? 'bg-forest-700 text-white' : 'text-forest-600 hover:bg-cream-200'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${opt.color}`}></span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Set Priority */}
      <div className="relative">
        <button
          onClick={() => { setShowPrioritySub(!showPrioritySub); setShowStatusSub(false); }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-forest-700 hover:bg-cream-200 transition-colors"
        >
          <Flag className="w-3.5 h-3.5" /> Priority
        </button>
        {showPrioritySub && (
          <div className="pl-8 pb-1">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChangePriority(opt.value); onClose(); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors rounded-lg ${currentPriority === opt.value ? 'bg-forest-700 text-white' : 'text-forest-600 hover:bg-cream-200'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${opt.color}`}></span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-1.5 border-t border-cream-200"></div>

      {/* Delete */}
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
};
