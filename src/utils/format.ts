export const todayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateOnly = (dateStr?: string | null): Date => {
  if (!dateStr) return new Date();
  // If ISO string containing 'T', parse safely
  if (typeof dateStr === 'string' && dateStr.includes('T')) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    }
  }
  const cleanStr = String(dateStr).split('T')[0];
  const parts = cleanStr.split(/[-/]/).map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? new Date() : fallback;
};

export const daysUntil = (dateStr?: string | null): number => {
  if (!dateStr) return 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = parseDateOnly(dateStr);
  const diff = target.getTime() - today.getTime();
  const days = Math.round(diff / 86400000);
  return isNaN(days) ? 0 : days;
};

export const isOverdue = (dateStr?: string | null): boolean => {
  if (!dateStr) return false;
  return daysUntil(dateStr) < 0;
};

export const formatShortDate = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  const parsed = parseDateOnly(dateStr);
  if (isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export const formatRelativeTime = (isoString?: string | null): string => {
  if (!isoString) return 'Recently';
  const time = new Date(isoString).getTime();
  if (isNaN(time)) return 'Recently';
  const diffMs = Date.now() - time;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export const normalizeText = (value: string): string =>
  value.trim().toLowerCase();

export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
