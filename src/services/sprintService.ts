import { api } from './apiClient';
import type { Sprint, MeetingItem } from '../types/sprint';

class SprintService {
  async getSprints(): Promise<Sprint[]> {
    return api.get<Sprint[]>('/sprints');
  }

  async createSprint(data: {
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
    meetings?: MeetingItem[];
  }): Promise<Sprint> {
    return api.post<Sprint>('/sprints', data);
  }

  async updateSprint(id: string, updates: Partial<Sprint>): Promise<Sprint> {
    return api.patch<Sprint>(`/sprints/${id}`, updates);
  }

  async deleteSprint(id: string): Promise<void> {
    await api.delete(`/sprints/${id}`);
  }
}

export const sprintService = new SprintService();
