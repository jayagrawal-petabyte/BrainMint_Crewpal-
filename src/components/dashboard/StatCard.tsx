import { memo, type ReactNode, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  className?: string;
  delay?: string;
}

export const StatCard = memo(
  ({ title, value, icon, className = '', delay = '0ms' }: StatCardProps) => {
    const spring = useSpring(0, { bounce: 0, duration: 1500 });
    const displayValue = useTransform(spring, (current) => Math.floor(current));

    useEffect(() => {
      spring.set(value);
    }, [spring, value]);

    return (
      <div
        className={`p-4 rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md card-animate ${className}`}
        style={{ animationDelay: delay }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs font-bold text-forest-900 opacity-70">{title}</h3>
          <span className="text-forest-800">{icon}</span>
        </div>
        <motion.p className="text-3xl font-extrabold text-forest-900">
          {displayValue}
        </motion.p>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

