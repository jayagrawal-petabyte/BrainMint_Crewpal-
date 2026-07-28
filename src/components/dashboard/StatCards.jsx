import React from 'react';
import { useStore } from '../../store/StateContext';
import { Users, GraduationCap, ListCheck, Percent, RefreshCw } from 'lucide-react';

export function StatCards() {
  const { metrics, metricsLoading, refreshMetrics } = useStore();

  if (metricsLoading) {
    return (
      <div className="metrics-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="metric-card skeleton" style={{ height: '106px' }}></div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'students',
      label: 'Total Enrolled Students',
      value: metrics.totalStudents.toLocaleString(),
      change: '+4.2%',
      isUp: true,
      icon: GraduationCap,
      colorClass: 'students'
    },
    {
      id: 'teachers',
      label: 'Faculty & Teachers',
      value: metrics.totalTeachers.toString(),
      change: '+2 active',
      isUp: true,
      icon: Users,
      colorClass: 'teachers'
    },
    {
      id: 'pendingTasks',
      label: 'Assigned Pending Tasks',
      value: metrics.pendingTasksCount.toString(),
      change: metrics.pendingTasksCount > 3 ? 'Action Needed' : 'On Track',
      isUp: metrics.pendingTasksCount <= 3,
      icon: ListCheck,
      colorClass: 'tasks'
    },
    {
      id: 'attendance',
      label: 'Average Attendance Rate',
      value: `${metrics.attendancePercent}%`,
      change: '+1.4% vs last month',
      isUp: true,
      icon: Percent,
      colorClass: 'attendance'
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
          School ERP Key Metrics
        </h3>
        <button className="btn btn-ghost btn-sm" onClick={refreshMetrics} title="Fetch fresh API metrics">
          <RefreshCw size={13} className={metricsLoading ? 'spin' : ''} />
          <span>Refresh API</span>
        </button>
      </div>

      <div className="metrics-grid">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <article key={card.id} className="metric-card">
              <div className={`metric-icon-box ${card.colorClass}`}>
                <IconComponent size={22} />
              </div>
              <div className="metric-info">
                <span className="metric-label">{card.label}</span>
                <strong className="metric-value">{card.value}</strong>
                <span className={`metric-trend ${card.isUp ? 'up' : 'down'}`}>
                  {card.change} <span>vs. last term</span>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
