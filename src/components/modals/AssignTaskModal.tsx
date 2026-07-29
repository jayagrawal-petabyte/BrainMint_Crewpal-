import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { MOCK_TEAM_MEMBERS } from '../../store/tasks';
import type { Assignee } from '../../types/task';

// ─── Assign Task Modal (Day 14) ────────────────────────────────────────────

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAssignees: Assignee[];
  onSave: (assignees: Assignee[]) => void;
}

export const AssignTaskModal = ({ isOpen, onClose, currentAssignees, onSave }: AssignTaskModalProps) => {
  const [selected, setSelected] = useState<Assignee[]>(currentAssignees);
  const [search, setSearch] = useState('');

  const toggleAssignee = (assignee: Assignee) => {
    setSelected((prev) =>
      prev.some((a) => a.id === assignee.id)
        ? prev.filter((a) => a.id !== assignee.id)
        : [...prev, assignee]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  const filteredMembers = MOCK_TEAM_MEMBERS.filter((m) =>
    search === '' || m.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-forest-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-cream-50 rounded-2xl shadow-xl w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="text-lg font-bold text-forest-900">Assign Team Members</h2>
          <button onClick={onClose} className="text-forest-400 hover:text-forest-700 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-forest-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="flex-1 text-sm text-forest-800 placeholder:text-forest-400 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="px-6 py-4 space-y-2 max-h-60 overflow-y-auto">
          {filteredMembers.map((member) => {
            const isSelected = selected.some((a) => a.id === member.id);
            return (
              <button
                key={member.id}
                onClick={() => toggleAssignee(member)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-forest-700 text-white'
                    : 'bg-white border border-cream-200 text-forest-800 hover:border-forest-400'
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : `${member.avatarColor ?? 'bg-olive-300'} text-forest-800`
                }`}>
                  {member.initials}
                </div>

                {/* Name */}
                <span className="flex-1 text-left text-sm font-medium">{member.name}</span>

                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-white border-white' : 'border-cream-300'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-cream-200">
          <span className="text-xs text-forest-500">{selected.length} selected</span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
