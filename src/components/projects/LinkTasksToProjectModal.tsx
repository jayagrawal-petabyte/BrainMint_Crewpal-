import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../ui/Modal';

interface LinkTasksToProjectModalProps {
  open: boolean;
  tasks: {
    id: string;
    title: string;
    status: string;
  }[];
  linkedTaskIds: string[];
  onClose: () => void;
  onSave: (taskIds: string[]) => void;
}

const getStatusClasses = (status: string) => {
  if (status === 'on_track') return 'border-olive-300 bg-olive-200 text-forest-800';
  if (status === 'delayed') return 'border-rose-300 bg-rose-200 text-rose-800';
  return 'border-cream-300 bg-cream-200 text-forest-700';
};

export const LinkTasksToProjectModal = ({
  open,
  tasks,
  linkedTaskIds,
  onClose,
  onSave,
}: LinkTasksToProjectModalProps) => {
  const [search, setSearch] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(linkedTaskIds);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setSearch('');
      setSelectedTaskIds(linkedTaskIds);
    }
    wasOpen.current = open;
  }, [linkedTaskIds, open]);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((currentIds) =>
      currentIds.includes(taskId)
        ? currentIds.filter((id) => id !== taskId)
        : [...currentIds, taskId]
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Link Tasks"
      size="md"
      footer={
        <>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={() => onSave(selectedTaskIds)}>
            Save Tasks
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks..."
          leftIcon={<Search className="h-4 w-4 text-forest-400" />}
          aria-label="Search tasks"
        />

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {filteredTasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-forest-500">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = selectedTaskIds.includes(task.id);

              return (
                <label
                  key={task.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                    isSelected
                      ? 'border-forest-300 bg-forest-50'
                      : 'border-cream-200 bg-white hover:border-forest-200'
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-forest-800">
                    {task.title}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(task.status)}`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleTask(task.id)}
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
