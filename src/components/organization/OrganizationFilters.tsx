import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import type {
  OrganizationFilterState,
  OrganizationStatusFilter,
  OrganizationPlanFilter,
  OrganizationSortKey,
} from '../../types/organization';

interface OrganizationFiltersProps {
  filters: OrganizationFilterState;
  onFilterChange: (updates: Partial<OrganizationFilterState>) => void;
  onResetFilters: () => void;
}

export const OrganizationFilters: React.FC<OrganizationFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const isFiltered =
    filters.search !== '' || filters.status !== 'all' || filters.planTier !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3 bg-cream-50 p-4 rounded-2xl border border-cream-200 shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 min-w-[240px]">
        <div className="flex items-center gap-2 bg-rose-100/70 border border-rose-200 rounded-full px-3.5 py-2 transition-all focus-within:border-forest-500 focus-within:ring-2 focus-within:ring-forest-500/20">
          <Search className="w-4 h-4 text-forest-600 shrink-0" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search organization by name, slug, or owner..."
            className="w-full bg-transparent text-xs md:text-sm text-forest-900 placeholder:text-forest-500/70 outline-none font-medium"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="text-forest-500 hover:text-forest-800 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Dropdown */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-forest-600 shrink-0" />
        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ status: e.target.value as OrganizationStatusFilter })
          }
          className="rounded-full border border-forest-200 bg-white px-3.5 py-2 text-xs font-semibold text-forest-800 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 cursor-pointer shadow-xs"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Plan Tier Dropdown */}
      <div className="flex items-center gap-2">
        <select
          value={filters.planTier}
          onChange={(e) =>
            onFilterChange({ planTier: e.target.value as OrganizationPlanFilter })
          }
          className="rounded-full border border-forest-200 bg-white px-3.5 py-2 text-xs font-semibold text-forest-800 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 cursor-pointer shadow-xs"
        >
          <option value="all">All Plans</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Pro">Pro</option>
          <option value="Starter">Starter</option>
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-forest-600 shrink-0" />
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({ sortBy: e.target.value as OrganizationSortKey })
          }
          className="rounded-full border border-forest-200 bg-white px-3.5 py-2 text-xs font-semibold text-forest-800 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 cursor-pointer shadow-xs"
        >
          <option value="name_asc">Name (A - Z)</option>
          <option value="name_desc">Name (Z - A)</option>
          <option value="members_desc">Most Members</option>
          <option value="date_desc">Newest First</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {isFiltered && (
        <button
          onClick={onResetFilters}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
