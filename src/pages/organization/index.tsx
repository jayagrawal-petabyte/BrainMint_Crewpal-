import React, { useState, useMemo } from 'react';
import { MOCK_ORGANIZATIONS } from '../../data/mockOrganizations';
import type {
  Organization,
  OrganizationFilterState,
} from '../../types/organization';
import { OrganizationHeader } from '../../components/organization/OrganizationHeader';
import { OrganizationStats } from '../../components/organization/OrganizationStats';
import { OrganizationFilters } from '../../components/organization/OrganizationFilters';
import { OrganizationCard } from '../../components/organization/OrganizationCard';
import { OrganizationDetailsModal } from '../../components/organization/OrganizationDetailsModal';
import { CreateOrganizationModal } from '../../components/organization/CreateOrganizationModal';
import { EmptyState } from '../../components/ui/EmptyState';

export const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [filters, setFilters] = useState<OrganizationFilterState>({
    search: '',
    status: 'all',
    planTier: 'all',
    sortBy: 'name_asc',
  });

  const handleFilterChange = (updates: Partial<OrganizationFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      planTier: 'all',
      sortBy: 'name_asc',
    });
  };

  const handleToggleStatus = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === id) {
          const updated = { ...org, is_active: !org.is_active };
          if (selectedOrg?.id === id) {
            setSelectedOrg(updated);
          }
          return updated;
        }
        return org;
      })
    );
  };

  const handleCreateOrganization = (
    newOrgData: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'projectCount'>
  ) => {
    const newOrg: Organization = {
      ...newOrgData,
      id: `org-${Date.now()}`,
      createdAt: new Date().toISOString(),
      memberCount: 1,
      projectCount: 0,
    };
    setOrganizations((prev) => [newOrg, ...prev]);
  };

  // Filter & Sort logic
  const filteredOrganizations = useMemo(() => {
    return organizations
      .filter((org) => {
        const matchesSearch =
          filters.search === '' ||
          org.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          org.slug.toLowerCase().includes(filters.search.toLowerCase()) ||
          org.domain.toLowerCase().includes(filters.search.toLowerCase()) ||
          org.owner.name.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus =
          filters.status === 'all' ||
          (filters.status === 'active' && org.is_active) ||
          (filters.status === 'inactive' && !org.is_active);

        const matchesTier =
          filters.planTier === 'all' || org.planTier === filters.planTier;

        return matchesSearch && matchesStatus && matchesTier;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        } else if (filters.sortBy === 'name_desc') {
          return b.name.localeCompare(a.name);
        } else if (filters.sortBy === 'members_desc') {
          return b.memberCount - a.memberCount;
        } else if (filters.sortBy === 'date_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [organizations, filters]);

  const activeCount = organizations.filter((o) => o.is_active).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* ─── HEADER ─── */}
      <OrganizationHeader
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        activeCount={activeCount}
        totalCount={organizations.length}
      />

      {/* ─── STATS SUMMARY ─── */}
      <OrganizationStats organizations={organizations} />

      {/* ─── FILTERS & SEARCH ─── */}
      <OrganizationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* ─── ORGANIZATION GRID ─── */}
      {filteredOrganizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrganizations.map((org, index) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              onSelect={setSelectedOrg}
              onToggleStatus={handleToggleStatus}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-8 text-center">
          <EmptyState
            type="search"
            title="No Organizations Found"
            description="No workplace matches your search or filter parameters. Try clearing filters or create a new organization."
          />
        </div>
      )}

      {/* ─── DETAILS MODAL ─── */}
      <OrganizationDetailsModal
        organization={selectedOrg}
        onClose={() => setSelectedOrg(null)}
        onToggleStatus={handleToggleStatus}
      />

      {/* ─── CREATE MODAL ─── */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateOrganization}
      />
    </div>
  );
};
