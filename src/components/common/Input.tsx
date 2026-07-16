import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

export const Input = ({
  className = '',
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  id,
  disabled,
  ...props
}: InputProps) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  const baseInputStyles = 'flex w-full rounded-full border bg-cream-50 px-4 py-2.5 text-sm transition-colors placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';
  const normalStyles = 'border-forest-200 focus:border-forest-500 focus:ring-forest-500/20';
  const errorStyles = 'border-rose-500 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500/20';
  
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium text-forest-700"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-forest-400">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          disabled={disabled}
          className={`${baseInputStyles} ${error ? errorStyles : normalStyles} ${
            leftIcon ? 'pl-11' : ''
          } ${rightIcon ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-forest-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-rose-500 mt-1">{error}</p>
      )}
      
      {!error && helperText && (
        <p className="text-sm text-forest-400 mt-1">{helperText}</p>
      )}
    </div>
  );
};

Input.displayName = 'Input';
