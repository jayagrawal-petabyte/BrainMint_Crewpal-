export type ProjectStatus = 'on_track' | 'delayed' | 'completed';

export interface Project {
  id: string;
  memberIds: string[];
  name: string;
  owner: string;
  status: ProjectStatus;
  isStarred: boolean;
  createdAt: string;
  description?: string;
  category?: string;
}

export type ProjectSortKey = 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc';

export interface ProjectFilter {
  search: string;
  status: ProjectStatus | 'all';
  starredOnly: boolean;
  sortBy: ProjectSortKey;
}
