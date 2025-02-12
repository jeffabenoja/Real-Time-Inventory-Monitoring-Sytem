import { useSelector } from "react-redux";
import { RootState } from "../../store/index"; // Adjust the import path based on your project structure
import Item from "../../components/notification/Item";
import PageTitle from "../../components/common/utils/PageTitle";

export default function Notifications() {
  const notifications = useSelector(
    (state: RootState) => state.notifcation.notifications
  );

  return (
    <>
      <PageTitle>Notifications</PageTitle>
      <ul className="flex flex-col gap-2">
        {notifications.length <= 0 ? (
          <p className="text-center">No Notifications</p>
        ) : (
          notifications.map(
            ({ id, message, timestamp, isCompleted, isRead }) => (
              <div key={id}>
                <Item
                  id={id}
                  message={message}
                  timestamp={timestamp}
                  isCompleted={isCompleted}
                  isRead={isRead}
                />
              </div>
            )
          )
        )}
      </ul>
    </>
  );
}
