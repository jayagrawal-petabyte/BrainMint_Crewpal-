import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../ui/Modal';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

interface ManageProjectMembersModalProps {
  open: boolean;
  members: TeamMember[];
  selectedMemberIds: string[];
  onClose: () => void;
  onSave: (memberIds: string[]) => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const ManageProjectMembersModal = ({
  open,
  members,
  selectedMemberIds,
  onClose,
  onSave,
}: ManageProjectMembersModalProps) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedMemberIds);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setSearch('');
      setSelectedIds(selectedMemberIds);
    }
    wasOpen.current = open;
  }, [open, selectedMemberIds]);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMember = (memberId: string) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(memberId)
        ? currentIds.filter((id) => id !== memberId)
        : [...currentIds, memberId]
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Manage Project Members"
      size="md"
      footer={
        <>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={() => onSave(selectedIds)}>
            Save Members
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search members..."
          leftIcon={<Search className="h-4 w-4 text-forest-400" />}
          aria-label="Search project members"
        />

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {filteredMembers.length === 0 ? (
            <p className="py-6 text-center text-sm text-forest-500">No members found.</p>
          ) : (
            filteredMembers.map((member) => {
              const isSelected = selectedIds.includes(member.id);

              return (
                <label
                  key={member.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                    isSelected
                      ? 'border-forest-300 bg-forest-50'
                      : 'border-cream-200 bg-white hover:border-forest-200'
                  }`}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt=""
                      className="h-9 w-9 rounded-full border border-cream-300 object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-olive-300 bg-olive-200 text-xs font-bold text-forest-800">
                      {getInitials(member.name)}
                    </div>
                  )}
                  <span className="flex-1 text-sm font-medium text-forest-800">{member.name}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMember(member.id)}
                    className="h-4 w-4 accent-forest-700"
                  />
                </label>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
