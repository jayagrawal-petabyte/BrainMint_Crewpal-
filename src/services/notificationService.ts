import { api } from './apiClient';
import type { Notification } from '../types/notification';

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    const data = await api.get<Notification[]>('/notifications');
    return Array.isArray(data) ? data : [];
  }
}

export const notificationService = new NotificationService();