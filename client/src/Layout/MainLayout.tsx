import { Outlet } from "react-router-dom";
import Header from "../components/navigation/Header";
import NotificationModal from "../components/notification/Modal";
import { useEffect, useRef, useState } from "react";
import Item from "../components/notification/Item";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Sidebar from "../components/navigation/Sidebar";

const MainLayout = () => {
  const [notifications, setNotifications] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [sidebar, setSidebar] = useState(false);
  const notificationItems = useSelector(
    (state: RootState) => state.notifcation.notifications
  );

  const notificationHandler = () => {
    setNotifications((prevState) => !prevState);
  };

  const menuToggle = () => {
    setSidebar(!sidebar);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        setNotifications(false);
      }
    };

    if (notifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifications]);

  return (
    <div className="relative">
      <Header
        toggleNotif={notificationHandler}
        iconRef={iconRef}
        handleSidebar={menuToggle}
      />
      <div className="hidden lg:block w-60 lg:w-64">
          <Sidebar />
        </div>
          {sidebar && <Sidebar close={menuToggle} />}
      {notifications && (
        <div ref={modalRef} className="fixed top-[70px] right-3 z-50">
          <NotificationModal>
            {notificationItems.length <= 0 ? (
              <p className="text-center">No Notifications</p>
            ) : (
              notificationItems.map(
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
          </NotificationModal>
        </div>
      )}
      <div className={`lg:ml-64 ${sidebar ? "overflow-hidden" : ""}`}>
        <div className="flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg px-4 lg:px-8 py-4 z-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
