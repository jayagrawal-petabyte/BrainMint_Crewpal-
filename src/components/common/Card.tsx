import type { HTMLAttributes } from 'react';
import React from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
  variant?: 'default' | 'olive' | 'rose' | 'teal' | 'forest';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', noPadding = false, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border border-olive-200 shadow-sm',
      olive: 'bg-olive-300 text-forest-900',
      rose: 'bg-rose-300 text-forest-900',
      teal: 'bg-teal-500 text-white',
      forest: 'bg-forest-700 text-white',
    };

    return (
      <div
        ref={ref}
        className={`rounded-2xl ${variantStyles[variant]} ${
          noPadding ? '' : 'p-5'
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 mb-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`font-semibold text-sm uppercase tracking-wide ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm opacity-80 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center mt-4 pt-3 border-t border-current/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
