import { memo } from 'react';

export const DashboardSkeleton = memo(() => {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading dashboard">
      <div className="skeleton h-24 w-full" />

      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-20 w-full col-span-2" />
      </div>

      <div className="skeleton h-14 w-full" />

      <div className="skeleton h-28 w-full" />
      <div className="skeleton h-28 w-full" />
      <div className="skeleton h-28 w-full" />
      <div className="skeleton h-28 w-full" />
    </div>
  );
});

DashboardSkeleton.displayName = 'DashboardSkeleton';
