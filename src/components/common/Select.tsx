import React, { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, options, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg border bg-[#fdf8e8] text-[#0b170e]
            focus:outline-none focus:ring-2 focus:ring-[#d4d9b8] transition-colors appearance-none
            ${error ? 'border-red-600 focus:ring-red-600' : 'border-[#d4d9b8]'}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Dropdown Arrow to replace the native one hidden by appearance-none */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[#1e3624]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;