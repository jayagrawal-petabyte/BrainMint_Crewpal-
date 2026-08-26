export type NotificationType = "email" | "in_app";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}