import {
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";
import { useToastStore } from "../../hooks/useToast";
import type { ToastType } from "../../hooks/useToast";

const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    bg: string;
    border: string;
    text: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-olive-100",
    border: "border-olive-300",
    text: "text-olive-800",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-rose-100",
    border: "border-rose-300",
    text: "text-rose-800",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-cream-200",
    border: "border-cream-300",
    text: "text-forest-800",
  },
  info: {
    icon: Info,
    bg: "bg-teal-100",
    border: "border-teal-300",
    text: "text-teal-800",
  },
};

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore(
    (state) => state.removeToast
  );

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-[9999] flex w-full max-w-sm flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const config = TOAST_CONFIG[toast.type];
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${config.bg} ${config.border} toast-enter`}
          >
            <Icon
              className={`w-5 h-5 shrink-0 ${config.text}`}
            />

            <p
              className={`flex-1 text-sm font-medium ${config.text}`}
            >
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className={`shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors ${config.text}`}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;