import { useEffect, useState } from "react";
import PageTitle from "../../components/common/utils/PageTitle";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < 3) {
        const newNotification: Notification = {
          id: count + 1,
          message: `Prediction #${count + 1}`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
        count++;
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg px-4 lg:px-8 py-4 gap-4">
      <PageTitle>Notifications</PageTitle>
      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-blue-700">{notif.message}</h3>
              <p className="text-sm text-gray-600">{notif.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
