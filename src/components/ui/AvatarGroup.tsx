interface AvatarGroupProps {
  users: Array<{ id: string; name: string; initials: string; color?: string }>;
  max?: number;
}

export const AvatarGroup = ({ users, max = 4 }: AvatarGroupProps) => {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - visibleUsers.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {visibleUsers.map((user) => (
        <div
          key={user.id}
          title={user.name}
          className={`flex h-6 w-6 items-center justify-center rounded-full border border-forest-900 text-[10px] font-bold text-forest-900 shadow-sm ${user.color ?? 'bg-cream-50'}`}
        >
          {user.initials}
        </div>
      ))}

      {remaining > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-forest-900 bg-cream-200 text-[9px] font-bold text-forest-700 shadow-sm">
          +{remaining}
        </div>
      )}
    </div>
  );
};
