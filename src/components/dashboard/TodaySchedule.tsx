import { memo } from 'react';
import { CalendarDays } from 'lucide-react';
import type { ScheduleItem } from '../../types/dashboard';

interface TodayScheduleProps {
  items: ScheduleItem[];
  title: string;
  onViewAll?: () => void;
}

export const TodaySchedule = memo(({ items, title, onViewAll }: TodayScheduleProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5 card-animate" style={{ animationDelay: '550ms' }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-forest-900">{title}</h3>
        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors cursor-pointer"
            >
              View All
            </button>
          )}
          <CalendarDays className="w-4 h-4 text-forest-700" />
        </div>
      </div>

      <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/10 p-3.5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2.5 items-start">
            <input
              type="checkbox"
              checked={item.completed}
              readOnly
              className="mt-0.5 w-3.5 h-3.5 accent-[#1e3624]"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-forest-900/50 font-medium">
                {item.time}
              </p>
              <p className="text-xs text-forest-900 leading-snug">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TodaySchedule.displayName = 'TodaySchedule';
