import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  trailingAction?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, trailingAction, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-forest/80 transition-colors"
          >
            {label}
          </label>
        )}
        <motion.div 
          className="relative"
          initial={false}
          animate={error ? { x: [-2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest/40 transition-colors peer-focus:text-forest">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "peer h-12 w-full rounded-xl border border-forest/15 bg-white/70 px-4 text-sm text-forest placeholder:text-forest/35 outline-none transition-all duration-200 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:bg-white",
              icon && "pl-11",
              trailingAction && "pr-11",
              error && "border-red-400 focus:border-red-500 focus:ring-red-200",
              className
            )}
            {...props}
          />
          {trailingAction && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailingAction}</span>
          )}
        </motion.div>
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              id={errorId} 
              role="alert" 
              className="mt-1.5 text-xs font-medium text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
