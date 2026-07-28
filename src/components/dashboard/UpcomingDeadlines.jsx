import React from 'react';
import { useStore } from '../../store/StateContext';
import { CalendarDays } from 'lucide-react';

export function UpcomingDeadlines() {
  const { deadlines } = useStore();

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <h2>Upcoming Deadlines</h2>
          <p>Important dates for academic & administrative submissions.</p>
        </div>
        <CalendarDays size={18} style={{ color: 'var(--primary)' }} />
      </div>

      <div>
        {deadlines.map((item, idx) => (
          <div key={idx} className="deadline-item">
            <div className="deadline-date-box">
              <div className="deadline-day">{item.day}</div>
              <div className="deadline-month">{item.month}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{item.title}</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{item.department}</small>
                <span className={`badge ${item.urgency === 'High' ? 'badge-high' : 'badge-low'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                  {item.urgency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
