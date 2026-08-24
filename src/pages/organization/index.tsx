import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  Organization,
  OrganizationFilterState,
} from '../../types/organization';
import { useOrganizationStore } from '../../store/organization';
import { OrganizationHeader } from '../../components/organization/OrganizationHeader';
import { OrganizationStats } from '../../components/organization/OrganizationStats';
import { OrganizationFilters } from '../../components/organization/OrganizationFilters';
import { OrganizationCard } from '../../components/organization/OrganizationCard';
import { OrganizationDetailsModal } from '../../components/organization/OrganizationDetailsModal';
import { CreateOrganizationModal } from '../../components/organization/CreateOrganizationModal';
import { InviteMemberModal } from '../../components/modals/InviteMemberModal';
import { EmptyState } from '../../components/ui/EmptyState';

export const OrganizationManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    organizations,
    selectedOrg,
    filters,
    fetchOrganizations,
    setSelectedOrg,
    setFilters,
    resetFilters,
    addOrganization,
    toggleOrganizationStatus,
    inviteMember,
  } = useOrganizationStore();

  useEffect(() => {
    void fetchOrganizations();
  }, [fetchOrganizations]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteOrgId, setInviteOrgId] = useState<string>('');

  const handleFilterChange = (updates: Partial<OrganizationFilterState>) => {
    setFilters(updates);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleOpenInviteModal = (orgId?: string) => {
    setInviteOrgId(orgId || selectedOrg?.id || organizations[0]?.id || '');
    setIsInviteModalOpen(true);
  };

  const handleOpenSettings = (orgId?: string) => {
    if (orgId) {
      const org = organizations.find((o) => o.id === orgId);
      if (org) {
        setSelectedOrg(org);
      }
    }
    navigate('/organization/settings');
  };

  const handleInviteSuccess = (details: { email: string; role: string; organizationId?: string; orgName?: string }) => {
    inviteMember(details);
  };

  const handleToggleStatus = (id: string) => {
    toggleOrganizationStatus(id);
  };

  const handleCreateOrganization = (
    newOrgData: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'projectCount'>
  ) => {
    addOrganization(newOrgData);
  };

  // Filter & Sort logic derived from store state
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
        onOpenInviteModal={() => handleOpenInviteModal()}
        onOpenSettings={() => handleOpenSettings()}
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
        onOpenInviteModal={(id) => handleOpenInviteModal(id)}
        onOpenSettings={(id) => handleOpenSettings(id)}
      />

      {/* ─── CREATE MODAL ─── */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateOrganization}
      />

      {/* ─── INVITE MEMBER MODAL ─── */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        organizations={organizations}
        defaultOrganizationId={inviteOrgId}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
};
