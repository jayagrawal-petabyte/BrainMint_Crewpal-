import { useNavigate } from 'react-router-dom';
import { CalendarView } from '../../components/views/CalendarView';
import { useTranslation } from '../../hooks/useTranslation';

export const Calendar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ─── HEADER ─── */}
      <div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
          {t.calendar}
        </h1>
        <p className="text-xs text-forest-700 font-medium mt-1">
          View tasks by due date across the month.
        </p>
      </div>

      {/* ─── CALENDAR ─── */}
      <div className="animate-in fade-in duration-200">
        <CalendarView onSelectTask={() => navigate('/tasks')} />
      </div>
    </div>
  );
};

export default Calendar;