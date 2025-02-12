export interface Notification {
  id: string;
  message: string;
  timestamp: Date | string | number;
  isCompleted: boolean;
  isRead: boolean
}
