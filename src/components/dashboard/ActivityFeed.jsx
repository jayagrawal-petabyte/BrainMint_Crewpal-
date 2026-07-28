import React from 'react';
import { useStore } from '../../store/StateContext';
import { Activity, Clock } from 'lucide-react';

export function ActivityFeed() {
  const { activities } = useStore();

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <h2>Recent Activity</h2>
          <p>Real-time audit log of team actions across the school ERP.</p>
        </div>
        <Activity size={18} style={{ color: 'var(--primary)' }} />
      </div>

      <div className="activity-feed">
        {activities.map((item) => (
          <div key={item.id} className="activity-item">
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '11px', flexShrink: 0 }}>
              {item.userInitials}
            </div>
            <div className="activity-details">
              <div>
                <span className="activity-user">{item.user}</span>{' '}
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>({item.role})</span>{' '}
                <span>{item.action}</span>{' '}
                <strong className="activity-target">{item.target}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span className="activity-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} /> {item.timestamp}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 6px' }}>
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
