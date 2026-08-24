import { create } from 'zustand';
import type {
  Organization,
  OrganizationFilterState,
} from '../../types/organization';
import { organizationService } from '../../services/organizationService';

export interface OrganizationState {
  organizations: Organization[];
  selectedOrg: Organization | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  loading: boolean;
  error: string | null;
  filters: OrganizationFilterState;

  // Store Actions
  fetchOrganizations: () => Promise<void>;
  setOrganizations: (organizations: Organization[]) => void;
  addOrganization: (
    newOrgData: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'projectCount'>
  ) => void;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  removeOrganization: (id: string) => void;
  deleteOrganization: (id: string) => void;
  toggleOrganizationStatus: (id: string) => void;
  setCurrentOrganization: (org: Organization | null) => void;
  setSelectedOrg: (org: Organization | null) => void;
  clearCurrentOrganization: () => void;
  inviteMember: (details: { organizationId?: string; email: string; role: string }) => void;

  // Filter & Search Actions
  setFilters: (updates: Partial<OrganizationFilterState>) => void;
  resetFilters: () => void;

  // Status & Error Handlers
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Selector
  getFilteredOrganizations: () => Organization[];
}

const DEFAULT_FILTERS: OrganizationFilterState = {
  search: '',
  status: 'all',
  planTier: 'all',
  sortBy: 'name_asc',
};

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organizations: [],
  selectedOrg: null,
  status: 'idle',
  loading: false,
  error: null,
  filters: DEFAULT_FILTERS,

  fetchOrganizations: async () => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const orgs = await organizationService.getOrganizations();
      set({
        organizations: Array.isArray(orgs) ? orgs : [],
        loading: false,
        status: 'success',
        selectedOrg: orgs.length > 0 ? (get().selectedOrg || orgs[0]) : null,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to retrieve organizations.',
        loading: false,
        status: 'error',
      });
    }
  },

  setOrganizations: (organizations) => set({ organizations }),

  addOrganization: (newOrgData) => {
    const initials = newOrgData.name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'OR';

    const newOrg: Organization = {
      ...newOrgData,
      id: `org-${Date.now()}`,
      createdAt: new Date().toISOString(),
      memberCount: 1,
      projectCount: 0,
      logoInitials: newOrgData.logoInitials || initials,
      accentBg: newOrgData.accentBg || 'bg-forest-800',
      accentText: newOrgData.accentText || 'text-cream-50',
    };

    set((state) => ({
      organizations: [newOrg, ...state.organizations],
      status: 'success',
    }));

    void organizationService.createOrganization(newOrgData);
  },

  updateOrganization: (id, updates) => {
    set((state) => {
      const updatedOrgs = state.organizations.map((org) =>
        org.id === id ? { ...org, ...updates } : org
      );
      const updatedSelected =
        state.selectedOrg?.id === id
          ? { ...state.selectedOrg, ...updates }
          : state.selectedOrg;

      return {
        organizations: updatedOrgs,
        selectedOrg: updatedSelected,
        status: 'success',
      };
    });

    void organizationService.updateOrganization(id, updates);
  },

  removeOrganization: (id) => {
    set((state) => ({
      organizations: state.organizations.filter((org) => org.id !== id),
      selectedOrg: state.selectedOrg?.id === id ? null : state.selectedOrg,
      status: 'success',
    }));

    void organizationService.deactivateOrganization(id);
  },

  deleteOrganization: (id) => {
    get().removeOrganization(id);
  },

  toggleOrganizationStatus: (id) => {
    set((state) => {
      let nowActive = false;
      const updatedOrgs = state.organizations.map((org) => {
        if (org.id === id) {
          nowActive = !org.is_active;
          return { ...org, is_active: nowActive };
        }
        return org;
      });

      const updatedSelected =
        state.selectedOrg?.id === id
          ? { ...state.selectedOrg, is_active: !state.selectedOrg.is_active }
          : state.selectedOrg;

      return {
        organizations: updatedOrgs,
        selectedOrg: updatedSelected,
        status: 'success',
      };
    });

    void organizationService.updateOrganization(id, {
      is_active: get().organizations.find((o) => o.id === id)?.is_active,
    });
  },

  setCurrentOrganization: (org) => set({ selectedOrg: org }),

  setSelectedOrg: (org) => set({ selectedOrg: org }),

  clearCurrentOrganization: () => set({ selectedOrg: null }),

  inviteMember: (details) => {
    const targetId = details.organizationId || get().selectedOrg?.id || get().organizations[0]?.id;
    if (!targetId) return;

    set((state) => {
      const updatedOrgs = state.organizations.map((org) =>
        org.id === targetId ? { ...org, memberCount: org.memberCount + 1 } : org
      );
      const updatedSelected =
        state.selectedOrg?.id === targetId
          ? { ...state.selectedOrg, memberCount: state.selectedOrg.memberCount + 1 }
          : state.selectedOrg;

      return {
        organizations: updatedOrgs,
        selectedOrg: updatedSelected,
        status: 'success',
      };
    });
  },

  setFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  setLoading: (loading) => set({ loading, status: loading ? 'loading' : 'idle' }),

  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),

  clearError: () => set({ error: null, status: 'idle' }),

  getFilteredOrganizations: () => {
    const { organizations, filters } = get();

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
  },
}));
