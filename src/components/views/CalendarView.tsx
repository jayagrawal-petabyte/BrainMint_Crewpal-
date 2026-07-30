import { useTaskStore } from '../../store/tasks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../../types/task';

// ─── Simple Monthly Calendar View ───────────────────────────────────────────

export const CalendarView = ({ onSelectTask }: { onSelectTask: (id: string) => void }) => {
  const tasks = useTaskStore((s) => s.getFilteredTasks());
  
  // Basic date math
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default to July 2026 for mock data
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group tasks by day
  const tasksByDay: Record<number, Task[]> = {};
  tasks.forEach(task => {
    const taskDate = new Date(task.dueDate);
    if (taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()) {
      const day = taskDate.getDate();
      if (!tasksByDay[day]) tasksByDay[day] = [];
      tasksByDay[day].push(task);
    }
  });

  return (
    <div className="bg-[#fdf8e8] rounded-xl border border-forest-900/20 p-4 space-y-4 shadow-sm animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between bg-cream-200 p-2 rounded-lg border border-cream-300">
        <button onClick={prevMonth} className="p-1 hover:bg-cream-300 rounded text-forest-900">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-extrabold text-forest-900 text-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-1 hover:bg-cream-300 rounded text-forest-900">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-forest-900/60 pb-2">
            {day}
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[80px] bg-transparent border border-transparent rounded-lg"></div>
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayTasks = tasksByDay[day] || [];
          
          return (
            <div 
              key={day} 
              className={`min-h-[80px] p-1 border rounded-lg flex flex-col ${
                dayTasks.length > 0 ? 'bg-white border-cream-300 shadow-sm' : 'bg-white/40 border-cream-200'
              }`}
            >
              <span className={`text-[10px] font-bold mb-1 ${dayTasks.length > 0 ? 'text-forest-900' : 'text-forest-900/40'}`}>
                {day}
              </span>
              <div className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => onSelectTask(task.id)}
                    className={`text-[9px] font-bold px-1 py-0.5 rounded cursor-pointer truncate ${
                      task.priority === 'high' ? 'bg-rose-200 text-rose-900' :
                      task.priority === 'medium' ? 'bg-olive-200 text-olive-900' :
                      'bg-cream-200 text-forest-900'
                    }`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
