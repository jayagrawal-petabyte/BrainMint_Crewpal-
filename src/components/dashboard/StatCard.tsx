import { memo, type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  className?: string;
  delay?: string;
}

export const StatCard = memo(
  ({ title, value, icon, className = '', delay = '0ms' }: StatCardProps) => (
    <div
      className={`p-4 rounded-2xl border shadow-sm card-animate ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-bold text-forest-900 opacity-70">{title}</h3>
        <span className="text-forest-800">{icon}</span>
      </div>
      <p className="text-3xl font-extrabold text-forest-900">{value}</p>
    </div>
  )
);

StatCard.displayName = 'StatCard';
