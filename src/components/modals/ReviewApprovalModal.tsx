import { CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useToast } from '../../hooks/useToast';

// ─── Review Approval Modal ───────────────────────────────────────────────────

export interface PendingApproval {
  id: string;
  name: string;
  owner: string;
  requestedAt: string;
  description?: string;
}

interface ReviewApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: PendingApproval | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ReviewApprovalModal = ({
  isOpen,
  onClose,
  approval,
  onApprove,
  onReject,
}: ReviewApprovalModalProps) => {
  const toast = useToast();

  if (!approval) return null;

  const handleApprove = () => {
    onApprove(approval.id);
    toast.success(`"${approval.name}" approved successfully`);
    onClose();
  };

  const handleReject = () => {
    onReject(approval.id);
    toast.success(`"${approval.name}" has been rejected`);
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-forest-600 bg-cream-200 hover:bg-cream-300 rounded-full transition-colors"
      >
        Close
      </button>
      <button
        onClick={handleReject}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-full transition-colors shadow-sm"
      >
        <XCircle className="w-4 h-4" />
        Reject
      </button>
      <button
        onClick={handleApprove}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-forest-900 hover:bg-forest-800 rounded-full transition-colors shadow-sm"
      >
        <CheckCircle className="w-4 h-4" />
        Approve
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Project Approval"
      subtitle="Review the request and approve or reject it"
      size="sm"
      footer={footer}
    >
      <div className="space-y-4">
        {/* Project Name */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-forest-500 uppercase tracking-wider">
            Project Name
          </p>
          <p className="text-base font-bold text-forest-900">{approval.name}</p>
        </div>

        {/* Requested By */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-forest-500 uppercase tracking-wider">
            Requested By
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-[10px] font-bold text-forest-600 border border-cream-300">
              {approval.owner.charAt(0)}
            </div>
            <p className="text-sm font-medium text-forest-800">{approval.owner}</p>
          </div>
        </div>

        {/* Requested At */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-forest-500 uppercase tracking-wider">
            Requested On
          </p>
          <p className="text-sm text-forest-700">
            {new Date(approval.requestedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Description */}
        {approval.description && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-forest-500 uppercase tracking-wider">
              Description
            </p>
            <p className="text-sm text-forest-700 leading-relaxed bg-cream-100 rounded-lg px-3 py-2.5 border border-cream-200">
              {approval.description}
            </p>
          </div>
        )}

        {/* Status badge */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-rose-50 border border-rose-200 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <p className="text-xs font-semibold text-rose-700">Awaiting your approval</p>
        </div>
      </div>
    </Modal>
  );
};
