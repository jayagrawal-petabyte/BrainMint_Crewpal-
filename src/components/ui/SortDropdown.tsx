import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import type { SortBy } from '../../store/tasks';

// ─── Sort Dropdown (Day 18) ─────────────────────────────────────────────────

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'name', label: 'Name' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

export const SortDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const sortBy = useTaskStore((s) => s.sortBy);
  const sortOrder = useTaskStore((s) => s.sortOrder);
  const setSortBy = useTaskStore((s) => s.setSortBy);
  const setSortOrder = useTaskStore((s) => s.setSortOrder);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort';

  const handleSelect = (value: SortBy) => {
    if (value === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  const OrderIcon = sortOrder === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-cream-200 text-forest-900 hover:bg-cream-300 transition-colors"
      >
        <ArrowUpDown className="w-3.5 h-3.5" />
        {currentLabel}
        <OrderIcon className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-cream-50 border border-cream-300 rounded-2xl shadow-xl z-50 py-2 slide-down-animate">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { handleSelect(opt.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors ${
                sortBy === opt.value ? 'bg-forest-700 text-white' : 'text-forest-700 hover:bg-cream-200'
              }`}
            >
              {opt.label}
              {sortBy === opt.value && <OrderIcon className="w-3 h-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
