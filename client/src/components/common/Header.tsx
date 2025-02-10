import { useState } from "react";
import { MdLightMode } from "react-icons/md";
import { HiOutlineMenu } from "react-icons/hi";
import Sidebar from "./Sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const [sidebar, setSidebar] = useState(false);
  const [notification, setNotification] = useState(false);
  const location = useLocation();

  const lastSegment = location.pathname.split("/").at(-1)!;

  const pageTitle = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  const menuToggle = () => {
    setSidebar(!sidebar);
  };

  return (
    <header className="flex justify-between items-center shadow-md border-gray-200 w-screen p-4">
      <div className="hidden lg:block w-60 lg:w-64">
        <Sidebar />
      </div>
      <div className="flex flex-1 font-heading items-center justify-between">
        <div className="hidden lg:block font-heading font-medium text-xl">
          {pageTitle} Page
        </div>
        <div className="font-heading lg:hidden">E&L Delicatessen</div>
        {sidebar && <Sidebar close={menuToggle} />}
        <div className="flex gap-2 items-center">
          <MdLightMode size={30} />
          <NavLink to="user/profile">
          <CgProfile size={30} />
          </NavLink>
          <IoIosNotifications size={30} />
          <div className="lg:hidden">
            <HiOutlineMenu size={30} onClick={menuToggle} />
          </div>
        </div>
      </div>
    </header>
  );
}
