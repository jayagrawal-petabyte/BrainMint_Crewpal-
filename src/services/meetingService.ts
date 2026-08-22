import { api } from './apiClient';
import type { MeetingItem } from '../types/sprint';

class MeetingService {
  async getMeetings(): Promise<MeetingItem[]> {
    return api.get<MeetingItem[]>('/meetings');
  }

  async createMeeting(sprintId: string, meeting: Omit<MeetingItem, 'id'>): Promise<MeetingItem> {
    return api.post<MeetingItem>(`/meetings`, { sprintId, ...meeting });
  }
}

export const meetingService = new MeetingService();
