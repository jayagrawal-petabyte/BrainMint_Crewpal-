import { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// ─── Generic Dropdown ───────────────────────────────────────────────────────
// A reusable, store-agnostic custom dropdown for use across CREWPAL modules
// (Status, Priority, Role, Project filters, Organization filters, etc.).
// It only knows about the options/value/onChange it is given — no business
// logic, no store connections.

export interface DropdownOption<T extends string | number = string> {
  label: string;
  value: T;
}

export interface DropdownProps<T extends string | number = string> {
  /** List of selectable options */
  options: DropdownOption<T>[];
  /** Currently selected value (controlled). Pass null/undefined for none selected. */
  value?: T | null;
  /** Called with the newly selected value */
  onChange: (value: T) => void;
  /** Label shown on the trigger when nothing is selected */
  placeholder?: string;
  /** Disables the trigger and prevents interaction */
  disabled?: boolean;
  /** Optional extra classes for positioning/sizing from the consuming page */
  className?: string;
}

export function Dropdown<T extends string | number = string>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const listboxId = useId();

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // When opened, focus the selected option (or the first one) for keyboard nav
  useEffect(() => {
    if (isOpen) {
      const startIndex = selectedIndex >= 0 ? selectedIndex : 0;
      setActiveIndex(startIndex);
      optionRefs.current[startIndex]?.focus();
    } else {
      setActiveIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const closeAndRefocusTrigger = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelect = (option: DropdownOption<T>) => {
    onChange(option.value);
    closeAndRefocusTrigger();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = (index + 1) % options.length;
        setActiveIndex(next);
        optionRefs.current[next]?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = (index - 1 + options.length) % options.length;
        setActiveIndex(prev);
        optionRefs.current[prev]?.focus();
        break;
      }
      case 'Home': {
        e.preventDefault();
        setActiveIndex(0);
        optionRefs.current[0]?.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        const last = options.length - 1;
        setActiveIndex(last);
        optionRefs.current[last]?.focus();
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(options[index]);
        break;
      case 'Escape':
        e.preventDefault();
        closeAndRefocusTrigger();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm font-medium
          bg-cream-50 border-cream-200 text-forest-900 transition-colors
          outline-none focus:ring-2 focus:ring-forest-200 focus:ring-offset-1
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cream-100 cursor-pointer'}
        `}
      >
        <span className={selectedOption ? 'text-forest-900' : 'text-forest-400 font-normal'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-forest-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          className="absolute left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto bg-cream-50 border border-cream-200 rounded-xl shadow-lg z-50 py-1.5 slide-down-animate"
        >
          {options.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-forest-400">No options available</li>
          ) : (
            options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="none">
                  <button
                    id={`${listboxId}-option-${index}`}
                    ref={(el) => { optionRefs.current[index] = el; }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => handleOptionKeyDown(e, index)}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors outline-none
                      ${isSelected ? 'bg-forest-700 text-white' : 'text-forest-700 hover:bg-cream-200 focus:bg-cream-200'}
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;