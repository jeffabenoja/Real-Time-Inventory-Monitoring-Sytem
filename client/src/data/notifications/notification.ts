import { Notification } from "../../type/notifications";

const notifications: Notification[] = [
  {
    id: "1",
    message: "Predicted stock shortage detected. Click to review required quantities.",
    timestamp: new Date().toISOString(),
    isCompleted: false,
    isRead: false,
  },
  {
    id: "2",
    message: "Upcoming demand may require additional stock. Tap to check details.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isCompleted: false,
    isRead: false,
  },
  {
    id: "3",
    message: "Inventory levels might not meet demand. Click to view stock recommendations.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    isRead: false,
  },
  {
    id: "4",
    message: "Projected stock needs updated. Tap to review required quantities.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    isRead: false,
  },
  {
    id: "5",
    message: "Supply forecast updated. Click to check if restocking is needed.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    isRead: false,
  },
];

export default notifications;