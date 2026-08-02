export type SprintStatus = 'planned' | 'active' | 'completed';

export interface MeetingItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  locationOrLink: string;
  attendeesCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  organizer: string;
  agenda?: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  meetings: MeetingItem[];
  createdAt: string;
  updatedAt: string;
}
