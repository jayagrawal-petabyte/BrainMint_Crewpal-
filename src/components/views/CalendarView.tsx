import { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Tag,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useTaskStore } from '../../store/tasks';
import { parseDateOnly } from '../../utils/format';
import { PriorityBadge, StatusBadge } from '../ui/Badges';
import type { Task, TaskStatus } from '../../types/task';

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

  // Tasks from store
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const isLoading = useTaskStore((state) => state.isLoading);

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      void fetchTasks();
    }
  }, [tasks, fetchTasks]);

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter tasks based on search & status filter
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter((t) => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.techTag && t.techTag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, searchQuery]);

  // Map tasks to days of current viewed month
  const tasksByDate = useMemo(() => {
    const map = new Map<number, Task[]>();
    filteredTasks.forEach((task) => {
      if (!task.dueDate) return;
      const dueDate = parseDateOnly(task.dueDate);
      if (
        dueDate.getFullYear() === year &&
        dueDate.getMonth() === month
      ) {
        const day = dueDate.getDate();
        const list = map.get(day) || [];
        list.push(task);
        map.set(day, list);
      }
    });
    return map;
  }, [filteredTasks, year, month]);

  // Tasks for the selected date
  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    return filteredTasks.filter((task) => {
      if (!task.dueDate) return false;
      const d = parseDateOnly(task.dueDate);
      return isSameDay(d, selectedDate);
    });
  }, [filteredTasks, selectedDate]);

  // Month Statistics
  const monthStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    let delayed = 0;
    let onTrack = 0;

    filteredTasks.forEach((task) => {
      if (!task.dueDate) return;
      const d = parseDateOnly(task.dueDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        total++;
        if (task.status === 'completed') completed++;
        else if (task.status === 'delayed') delayed++;
        else onTrack++;
      }
    });

    return { total, completed, delayed, onTrack };
  }, [filteredTasks, year, month]);

  return (
    <div className="space-y-6">
      {/* ─── CALENDAR CONTAINER ─── */}
      <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/15 p-4 sm:p-6 space-y-5 shadow-xs">
        
        {/* ─── Header: Controls & Navigation ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-cream-200/80 p-3.5 rounded-xl border border-cream-300">
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-cream-300 rounded-xl text-forest-900 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-forest-900 text-base sm:text-lg min-w-[170px] text-center tracking-tight">
              {MONTH_NAMES[month]} {year}
            </h3>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-cream-300 rounded-xl text-forest-900 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={goToToday}
              className="ml-2 flex items-center gap-1.5 bg-forest-800 hover:bg-forest-900 text-cream-50 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>

            {isLoading && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-forest-700 animate-pulse ml-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Syncing...</span>
              </span>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-cream-300 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-forest-900 placeholder:text-forest-400 outline-none w-28 sm:w-36 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-cream-300 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-forest-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
                className="bg-transparent text-xs font-semibold text-forest-900 outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="on_track">On Track</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─── Month Summary Badges ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-white/80 p-2.5 rounded-xl border border-cream-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-forest-800" />
              <span className="text-xs font-semibold text-forest-800">Total Due</span>
            </div>
            <span className="text-xs font-extrabold text-forest-900 bg-cream-200 px-2 py-0.5 rounded-lg">
              {monthStats.total}
            </span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-cream-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-semibold text-emerald-900">On Track</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
              {monthStats.onTrack}
            </span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-cream-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold text-rose-900">Delayed</span>
            </div>
            <span className="text-xs font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-lg">
              {monthStats.delayed}
            </span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-cream-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-olive-700" />
              <span className="text-xs font-semibold text-olive-900">Completed</span>
            </div>
            <span className="text-xs font-extrabold text-olive-800 bg-olive-100 px-2 py-0.5 rounded-lg">
              {monthStats.completed}
            </span>
          </div>
        </div>

        {/* ─── Day-of-week labels ─── */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-bold text-forest-800/70 pb-1 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}

          {/* ─── Empty leading cells ─── */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[85px] sm:min-h-[110px] bg-cream-100/40 rounded-xl border border-dashed border-cream-300/60"
            />
          ))}

          {/* ─── Day cells ─── */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const cellDate = new Date(year, month, day);
            const isToday = isSameDay(cellDate, today);
            const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
            const dayTasks = tasksByDate.get(day) || [];

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(cellDate)}
                tabIndex={0}
                role="button"
                aria-label={`Select date ${day} ${MONTH_NAMES[month]} ${year}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDate(cellDate);
                  }
                }}
                className={`min-h-[85px] sm:min-h-[110px] p-1.5 sm:p-2 border rounded-xl flex flex-col justify-between transition-all cursor-pointer text-left group ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/40 shadow-xs'
                    : isToday
                    ? 'bg-olive-50/80 border-forest-600/50 shadow-2xs'
                    : 'bg-white border-cream-300 hover:bg-cream-100/80 hover:border-forest-700/30'
                }`}
              >
                {/* Cell Header: Day Number + Badges */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-rose-600 text-white'
                        : isToday
                        ? 'bg-forest-800 text-cream-50'
                        : 'text-forest-900 group-hover:text-forest-800'
                    }`}
                  >
                    {day}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-forest-700 bg-cream-200 px-1.5 py-0.2 rounded-md">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Day Tasks List / Badges */}
                <div className="space-y-1 my-1 flex-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map((t) => {
                    const isDelayed = t.status === 'delayed';
                    const isCompleted = t.status === 'completed';

                    return (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(cellDate);
                          onSelectTask(t.id);
                        }}
                        title={`${t.title} (${t.status.replace('_', ' ')})`}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold truncate transition-transform hover:scale-[1.02] flex items-center gap-1 ${
                          isDelayed
                            ? 'bg-rose-100/90 text-rose-900 border border-rose-300/80'
                            : isCompleted
                            ? 'bg-olive-200/70 text-forest-900 border border-olive-300/80'
                            : 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isDelayed
                              ? 'bg-rose-600'
                              : isCompleted
                              ? 'bg-olive-600'
                              : 'bg-emerald-600'
                          }`}
                        />
                        <span className="truncate">{t.title}</span>
                      </div>
                    );
                  })}

                  {dayTasks.length > 2 && (
                    <div className="text-[9px] font-bold text-forest-700/80 px-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>

                {/* Today indicator dot */}
                {isToday && (
                  <div className="flex items-center gap-1 text-[9px] font-bold text-forest-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-800" />
                    <span className="hidden sm:inline">Today</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SELECTED DATE DETAILS PANEL ─── */}
      <div className="bg-[#fdf8e8] rounded-2xl border border-forest-900/15 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-300 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600">
              Selected Date Schedule
            </span>
            <h4 className="text-lg font-extrabold text-forest-900">
              {selectedDate.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-forest-800 bg-white px-3 py-1.5 rounded-xl border border-cream-300 shadow-2xs">
              {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'Task' : 'Tasks'} Due
            </span>
          </div>
        </div>

        {/* Task Cards for Selected Date */}
        {selectedDateTasks.length === 0 ? (
          <div className="py-8 text-center bg-white/60 rounded-xl border border-dashed border-cream-300 space-y-2">
            <CalendarDays className="w-8 h-8 text-forest-400 mx-auto" />
            <p className="text-xs font-bold text-forest-900">
              No tasks due on this date.
            </p>
            <p className="text-[11px] text-forest-600 max-w-sm mx-auto">
              Select another day on the calendar or navigate to tasks to create new deliverables.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="p-4 bg-white rounded-xl border border-cream-300 hover:border-forest-700/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-forest-700 bg-cream-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {task.techTag || 'Project'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={task.status} size="sm" />
                      <PriorityBadge priority={task.priority} size="sm" />
                    </div>
                  </div>

                  <h5 className="text-sm font-bold text-forest-900 group-hover:text-forest-700 transition-colors leading-snug">
                    {task.title}
                  </h5>

                  {task.description && (
                    <p className="text-xs text-forest-700/80 line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cream-200 text-xs">
                  <div className="flex items-center gap-1.5 text-forest-700">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">
                      {task.assignees?.length || 0} Assignees
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(task.id);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-forest-900 hover:text-forest-700 transition-colors"
                  >
                    <span>View Task</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;