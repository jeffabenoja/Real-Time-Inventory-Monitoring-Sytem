import { HiDocumentSearch } from "react-icons/hi";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaCoins } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { TbLogout2 } from "react-icons/tb";
import { FaUserCog } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

import NavItem from "./NavItem";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/auth";
import CustomModal from "../common/utils/CustomModalV2";
import { useState } from "react";

const NAVIGATION_ITEMS = [
  { name: "Overview", to: "/dashboard/overview", icon: HiDocumentSearch },
  {
    name: "Products",
    to: "/dashboard/products",
    icon: MdProductionQuantityLimits,
  },
  { name: "Sales", to: "/dashboard/sales", icon: FaCoins },
  { name: "Stocklist", to: "/dashboard/stocklist", icon: FaClipboardList },
  { name: "Reports", to: "/dashboard/reports", icon: HiDocumentReport },
];

const ADMIN_ITEMS = [
  { name: "User Settings", to: "admin/users", icon: FaUserCog },
  { name: "Group Settings", to: "admin/groups", icon: FaUsers },
];

export default function Container({
  closeSidebar,
}: {
  closeSidebar: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [logoutModal, setLogoutModal] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const logoHandler = () => {
    navigate("/dashboard/overview");
  };

  const logoutModalClose = () => {
    setLogoutModal(false);
  };

  const logoutModalOpen = () => {
    setLogoutModal(true)
  }

  return (
    <div className="font-primary h-screen">
      <div className="hidden text-white lg:flex flex-col items-center py-[17px] border-b-[1px] border-white font-heading">
        <h2
          className="text-xl flex items-center gap-2 cursor-pointer"
          onClick={logoHandler}
        >
          E&L DELICATESSEN
        </h2>
      </div>
      <div className="h-fit text-white px-5 flex flex-col gap-5 py-5">
        <div>
          <p className="text-base">
            {user?.first_name + " " + user?.last_name}{" "}
          </p>
          <p className="text-xs">{user?.userGroup.code}</p>
        </div>
        <div>
          <p className="text-sm">Dashboard</p>
          {NAVIGATION_ITEMS.map(({ name, to, icon }) => (
            <NavItem
              label={name}
              path={to}
              icon={icon}
              key={name}
              clicked={closeSidebar}
            />
          ))}
        </div>
        {user?.userGroup.isAdmin && (
          <div>
            <p className="text-sm">Admin</p>
            {ADMIN_ITEMS.map(({ name, to, icon }) => (
              <NavItem
                label={name}
                path={to}
                icon={icon}
                key={name}
                clicked={closeSidebar}
              />
            ))}
          </div>
        )}
      </div>
      <div
        className="text-white absolute bottom-5 left-5 text-base font-primary flex gap-3 hover:text-primary cursor-pointer font-medium"
        onClick={logoutModalOpen}
      >
        <TbLogout2 size={20} /> Logout
        {logoutModal && <CustomModal closeModal={logoutModalClose}>
          <p className="text-center">Are you sure you want to log out?</p>
          <div className="flex justify-center gap-5 mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 active:bg-gray-500 transition duration-150 ease-in-out"
              onClick={logoutModalClose}
            >
              No
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 active:bg-red-500 transition duration-150 ease-in-out"
              onClick={logoutHandler}
            >
              Yes
            </button>
          </div>
        </CustomModal>}
      </div>
    </div>
  );
}
