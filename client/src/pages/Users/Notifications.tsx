import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/index'; // Adjust the import path based on your project structure
import { appendNotification, replaceNotifications } from '../../store/slices/notifications'; // Adjust the import path
import { Notification } from '../../type/notifications';

let isInitital = true
const Notifications = () => {
  const notifications = useSelector((state: RootState) => state.notifcation.notifications);
  const dispatch = useDispatch();
  let count = 0;

  useEffect(() => {
    if(isInitital){
     dispatch(replaceNotifications([]))
     isInitital = false
    }
    const interval = setInterval(() => {
      if (count < 5) {
        const newNotification: Notification = {
          id: `${Date.now()}-${count}`,
          title: `Notification ${count + 1}`,
          message: `This is message number ${count + 1}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          completed: false,
        };

        dispatch(appendNotification(newNotification));
        count++;
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id} className="border p-2 rounded mb-2 shadow">
            <h3 className="font-semibold">{notif.title}</h3>
            <p>{notif.message}</p>
            <small>{new Date(notif.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
