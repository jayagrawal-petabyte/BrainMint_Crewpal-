import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface CalendarViewProps {
  onSelectTask: (id: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const CalendarView = ({ onSelectTask }: CalendarViewProps) => {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const goToPrevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));

  const goToNextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const handleViewInTasks = () => {
    if (selectedDate) {
      onSelectTask(selectedDate.toISOString());
    }
  };

  return (
    <div className="bg-[#fdf8e8] rounded-xl border border-forest-900/20 p-4 space-y-4 shadow-sm">
      {/* ─── Header: Month/Year + Navigation ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-cream-200 p-2.5 rounded-lg border border-cream-300">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-1.5 hover:bg-cream-300 rounded-lg text-forest-900 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h3 className="font-extrabold text-forest-900 text-sm min-w-[140px] text-center">
            {MONTH_NAMES[month]} {year}
          </h3>

          <button
            onClick={goToNextMonth}
            className="p-1.5 hover:bg-cream-300 rounded-lg text-forest-900 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="flex items-center gap-1.5 bg-forest-800 hover:bg-forest-900 text-cream-50 px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          Today
        </button>
      </div>

      {/* ─── Day-of-week labels ─── */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-bold text-forest-900/60 pb-1"
          >
            {day}
          </div>
        ))}

        {/* ─── Empty leading cells ─── */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[56px] sm:min-h-[72px]" />
        ))}

        {/* ─── Day cells ─── */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const cellDate = new Date(year, month, day);
          const isToday = isSameDay(cellDate, today);
          const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;

          return (
            <button
              key={day}
              onClick={() => handleSelectDay(day)}
              className={`min-h-[56px] sm:min-h-[72px] p-1.5 border rounded-lg flex flex-col items-center justify-start transition-colors ${
                isSelected
                  ? 'bg-rose-200 border-rose-400 shadow-sm'
                  : isToday
                  ? 'bg-olive-400 border-olive-500 shadow-sm'
                  : 'bg-white border-cream-300 hover:bg-cream-100'
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  isSelected
                    ? 'text-rose-900'
                    : isToday
                    ? 'text-forest-900'
                    : 'text-forest-900/70'
                }`}
              >
                {day}
              </span>
              {isToday && (
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-forest-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Selected date footer action ─── */}
      {selectedDate && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-cream-300">
          <p className="text-xs font-semibold text-forest-900">
            Selected:{' '}
            {selectedDate.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <button
            onClick={handleViewInTasks}
            className="px-4 py-2 bg-[#1e3624] hover:bg-[#142619] text-white rounded-full text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            View Tasks
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;