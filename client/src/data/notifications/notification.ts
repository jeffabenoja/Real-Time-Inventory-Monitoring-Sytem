import { Notification } from "../../type/notifications";

const notifications: Notification[] = [
  {
    id: "1",
    message: "Low Stock Prediction: 30 pcs of Coconut needed to meet weekend demand.",
    timestamp: new Date().toISOString(), // Most recent
    isCompleted: false,
    isRead: false,
  },
  {
    id: "2",
    message: "We predict that you need 20 kg of Sugar for this week’s Halo-Halo demand.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    isCompleted: false,
    isRead: false,
  },
  {
    id: "3",
    message: "Inventory Alert: You’ll need 150 pcs of Saba based on current sales trends.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isCompleted: false,
    isRead: false,
  },
  {
    id: "4",
    message: "Forecast shows you’ll require 50 cans of Evaporated Milk for the next 3 days.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isCompleted: false,
    isRead: false,
  },
  {
    id: "5",
    message: "Adzuki Beans stock may run low soon. Predicted need: 10 kg this week.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    isCompleted: false,
    isRead: false,
  },
];

export default notifications;