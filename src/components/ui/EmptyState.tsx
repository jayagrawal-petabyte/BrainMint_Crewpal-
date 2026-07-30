import { SearchX, CheckCircle, PackageOpen } from 'lucide-react';

export type EmptyStateType = 'search' | 'status' | 'empty';

interface EmptyStateProps {
  type: EmptyStateType;
  title: string;
  description: string;
}

export const EmptyState = ({ type, title, description }: EmptyStateProps) => {
  const getIcon = () => {
    switch (type) {
      case 'search': return <SearchX className="w-12 h-12 text-forest-900/30 mb-3 mx-auto" />;
      case 'status': return <CheckCircle className="w-12 h-12 text-olive-500/50 mb-3 mx-auto" />;
      default: return <PackageOpen className="w-12 h-12 text-forest-900/30 mb-3 mx-auto" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in fade-in">
      {getIcon()}
      <h3 className="text-sm font-extrabold text-forest-900 mb-1">{title}</h3>
      <p className="text-xs font-medium text-forest-900/60 max-w-[250px]">{description}</p>
    </div>
  );
};
