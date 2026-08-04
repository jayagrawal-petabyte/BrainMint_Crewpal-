import { useRef, useEffect } from 'react';
import { Edit3, Trash2, Archive } from 'lucide-react';

// ─── Project Actions Menu ─────────────────────────────────────────────────────

interface ProjectActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectActionsMenu = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProjectActionsMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-40 bg-cream-50 border border-cream-200 rounded-lg shadow-lg z-40 py-1 overflow-hidden">
      {/* Edit */}
      <button
        onClick={() => { onEdit(); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-forest-700 hover:bg-cream-200 transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5" /> Edit
      </button>

      {/* Archive (disabled/mock) */}
      <button
        disabled
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-forest-400 cursor-not-allowed"
      >
        <Archive className="w-3.5 h-3.5" /> Archive
      </button>

      {/* Divider */}
      <div className="my-1 border-t border-cream-200"></div>

      {/* Delete */}
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
};
