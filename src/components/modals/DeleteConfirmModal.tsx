import { X, AlertTriangle } from 'lucide-react';

// ─── Delete Confirm Modal (Day 13) ─────────────────────────────────────────

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-forest-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-cream-50 rounded-2xl shadow-xl w-full max-w-sm mx-4">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-forest-400 hover:text-forest-700 transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-6 pt-6 pb-4 text-center space-y-4">
          {/* Warning Icon */}
          <div className="w-12 h-12 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-forest-900">Delete Task</h3>
            <p className="text-sm text-forest-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-forest-700">"{taskTitle}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-cream-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-forest-600 bg-cream-200 hover:bg-cream-300 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-full transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
