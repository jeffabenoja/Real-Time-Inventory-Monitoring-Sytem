import { HiOutlineMenu } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa6";

interface Props {
  toggleNotif: () => void;
  iconRef: React.RefObject<HTMLDivElement>,
  handleSidebar: () => void;
}

export default function Header({ toggleNotif, iconRef, handleSidebar }: Props) {

  return (
    <>
      <header className="flex justify-between items-center shadow-md border-gray-200 w-full p-4 sticky top-0 z-40 bg-white">
        <div className="flex flex-1 font-heading items-center justify-between lg:justify-end">
          <div className="font-heading lg:hidden">E&L Delicatessen</div>
          <div className="flex gap-2 items-center">
            <div className="md:hidden cursor-pointer">
              <NavLink to="user/notifications" className="relative">
                <IoIosNotifications size={30} />
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  5
                </span>
              </NavLink>
            </div>
            <div className="hidden md:block relative cursor-pointer" onClick={toggleNotif} ref={iconRef}>
              <IoIosNotifications size={30} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  5
                </span>
            </div>
            <NavLink to="user/profile">
              <FaUser size={23} />
            </NavLink>
            <div className="lg:hidden">
              <HiOutlineMenu size={30} onClick={handleSidebar} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
