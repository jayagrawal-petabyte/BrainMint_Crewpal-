import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, Users, BarChart3 } from 'lucide-react';
import type { QuickAction, QuickActionIcon } from '../../types/dashboard';

const ICON_MAP: Record<QuickActionIcon, typeof Plus> = {
  plus: Plus,
  folder: FolderKanban,
  users: Users,
  chart: BarChart3,
};

interface QuickActionsProps {
  actions: QuickAction[];
  title: string;
}

export const QuickActions = memo(({ actions, title }: QuickActionsProps) => {
  const navigate = useNavigate();

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5 card-animate" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-bold text-forest-900">{title}</h3>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action) => {
          const Icon = ICON_MAP[action.icon] ?? Plus;

          return (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-1.5 bg-[#1e3624] hover:bg-[#142619] text-[#f5f0e1] px-2 py-3 rounded-2xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Icon className="w-4 h-4 text-[#d4a0a0]" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';
