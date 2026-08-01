export type OrganizationPlanTier = 'Enterprise' | 'Pro' | 'Starter';

export interface OrganizationOwner {
  name: string;
  email: string;
  avatarInitials: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string;
  is_active: boolean;
  planTier: OrganizationPlanTier;
  owner: OrganizationOwner;
  memberCount: number;
  projectCount: number;
  createdAt: string;
  description: string;
  industry: string;
  logoInitials: string;
  accentBg?: string;
  accentText?: string;
}

export type OrganizationStatusFilter = 'all' | 'active' | 'inactive';
export type OrganizationPlanFilter = 'all' | OrganizationPlanTier;
export type OrganizationSortKey = 'name_asc' | 'name_desc' | 'members_desc' | 'date_desc';

export interface OrganizationFilterState {
  search: string;
  status: OrganizationStatusFilter;
  planTier: OrganizationPlanFilter;
  sortBy: OrganizationSortKey;
}
