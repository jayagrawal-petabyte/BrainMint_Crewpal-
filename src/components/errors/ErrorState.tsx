import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message,
  onRetry,
  compact = false,
}: ErrorStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-2xl border border-rose-200 bg-rose-50 ${
        compact ? 'p-4' : 'p-8'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-extrabold text-forest-900 mb-1">{title}</h3>
      <p className="text-xs font-medium text-forest-900/60 max-w-[280px] mb-4">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 bg-[#1e3624] text-[#f5f0e1] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#142619] transition-colors active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};
