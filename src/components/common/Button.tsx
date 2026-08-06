import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', leftIcon, rightIcon, children, isLoading, disabled, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:pointer-events-none overflow-hidden';
    
    const variants = {
      primary: 'bg-forest-900 text-cream-50 hover:bg-forest-800 hover:shadow-md focus-visible:ring-forest-900',
      secondary: 'bg-cream-200 text-forest-900 hover:bg-cream-300 hover:shadow-sm focus-visible:ring-cream-400',
      ghost: 'bg-transparent text-forest-700 hover:bg-forest-100 focus-visible:ring-forest-300',
      danger: 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-md focus-visible:ring-rose-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        <span className={`inline-flex items-center justify-center transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </span>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
