import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-cream-200 ${noPadding ? '' : 'p-5'} ${className}`}>
      {children}
    </div>
  );
};
