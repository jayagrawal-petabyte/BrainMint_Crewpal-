import { useEffect, useId, useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <div tabIndex={0} aria-describedby={id} className="outline-none">
        {children}
      </div>

      {visible && (
        <div
          id={id}
          role="tooltip"
          className={`absolute z-20 whitespace-nowrap rounded-full bg-forest-900 px-2.5 py-1 text-[10px] font-semibold text-cream-50 shadow-lg ${
            position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
          } left-1/2 -translate-x-1/2`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
