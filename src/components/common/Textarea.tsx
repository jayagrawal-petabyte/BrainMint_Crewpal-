import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-lg border bg-[#fdf8e8] text-[#0b170e] placeholder-[#1e3624]/50
          focus:outline-none focus:ring-2 focus:ring-[#d4d9b8] transition-colors resize-y min-h-[100px]
          ${error ? 'border-red-600 focus:ring-red-600' : 'border-[#d4d9b8]'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;