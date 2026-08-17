import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  /** Text label shown for this breadcrumb level */
  label: string;
  /** Optional internal route to navigate to. Omit for non-clickable levels. */
  path?: string;
}

export interface BreadcrumbsProps {
  /** Ordered list of breadcrumb levels, from root to current page */
  items: BreadcrumbItem[];
  /** Optional extra classes for layout tweaks in a specific page */
  className?: string;
}

export const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`overflow-x-auto no-scrollbar ${className}`}
    >
      <ol className="flex items-center flex-nowrap gap-1.5 whitespace-nowrap text-xs font-medium">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="flex items-center">
                {!isLast && item.path ? (
                  <Link
                    to={item.path}
                    className="text-forest-500 hover:text-forest-800 transition-colors rounded-md outline-none focus:ring-2 focus:ring-forest-200 focus:ring-offset-1"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? 'text-forest-900 font-semibold' : 'text-forest-500'}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>

              {!isLast && (
                <li aria-hidden="true" className="flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-forest-400 shrink-0" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;