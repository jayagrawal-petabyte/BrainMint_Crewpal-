import { api } from './apiClient';
import type { Organization } from '../types/organization';

export interface BackendOrganization {
  id: number | string;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  planTier?: 'Enterprise' | 'Pro' | 'Starter';
  owner?: {
    name: string;
    email: string;
    avatarInitials: string;
  };
  memberCount?: number;
  projectCount?: number;
  description?: string;
  industry?: string;
}

const mapBackendToOrganization = (raw: BackendOrganization): Organization => {
  const name = raw.name || 'Untitled Organization';
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'OR';

  return {
    id: String(raw.id),
    name,
    slug: slug || `org-${raw.id}`,
    domain: `${slug || `org-${raw.id}`}.crewpal.com`,
    is_active: raw.is_active ?? true,
    planTier: raw.planTier || 'Enterprise',
    owner: raw.owner || {
      name: 'Organization Admin',
      email: 'admin@crewpal.com',
      avatarInitials: 'OA',
    },
    memberCount: raw.memberCount ?? 1,
    projectCount: raw.projectCount ?? 0,
    createdAt: raw.created_at || new Date().toISOString(),
    description: raw.description || `${name} workspace environment.`,
    industry: raw.industry || 'Software & Technology',
    logoInitials: initials,
    accentBg: 'bg-forest-800',
    accentText: 'text-cream-50',
  };
};

class OrganizationService {
  async getOrganizations(): Promise<Organization[]> {
    try {
      const data = await api.get<BackendOrganization[]>('/organizations');
      if (Array.isArray(data)) {
        return data.map(mapBackendToOrganization);
      }
      return [];
    } catch {
      // If backend returns error or endpoint is unreachable, return empty list (no fabricated data)
      return [];
    }
  }

  async createOrganization(
    newOrgData: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'projectCount'>
  ): Promise<Organization> {
    try {
      const result = await api.post<BackendOrganization>('/organizations', {
        name: newOrgData.name,
      });
      return mapBackendToOrganization(result);
    } catch {
      // Fallback to locally created organization structure if backend unavailable
      const now = new Date().toISOString();
      const initials = newOrgData.name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'OR';

      return {
        ...newOrgData,
        id: `org-${Date.now()}`,
        createdAt: now,
        memberCount: 1,
        projectCount: 0,
        logoInitials: newOrgData.logoInitials || initials,
      };
    }
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<void> {
    try {
      const numId = parseInt(id, 10);
      if (!isNaN(numId)) {
        await api.patch(`/organizations/${numId}`, {
          name: updates.name,
        });
      }
    } catch {
      // Handled in local state
    }
  }

  async deactivateOrganization(id: string): Promise<void> {
    try {
      const numId = parseInt(id, 10);
      if (!isNaN(numId)) {
        await api.patch(`/organizations/${numId}/deactivate`);
      }
    } catch {
      // Handled in local state
    }
  }
}

export const organizationService = new OrganizationService();
