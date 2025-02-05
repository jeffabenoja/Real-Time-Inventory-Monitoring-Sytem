import { HiDocumentSearch } from "react-icons/hi";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaCoins } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { TbLogout2 } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { FaUserCog } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";




import NavItem from "./NavItem";

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

const USER_ITEMS = [
  { name: "Profile", to: "user/profile", icon: CgProfile },
  { name: "Notifications", to: "user/notifications", icon: IoIosNotifications },
]

const ADMIN_ITEMS = [
  { name: "Users", to: "admin/users", icon: FaUserCog },
  { name: "User Groups", to: "admin/groups", icon: FaUsers },
];

export default function Container() {
  return (
    <div className="font-primary h-screen">
      <div className="hidden text-white lg:flex flex-col items-center py-[3px] border-b-[1px] border-white">
        <h2 className="text-3xl">E&L</h2>
        <span className="text-sm">Delicatessen</span>
      </div>
      <div className="h-fit text-white px-5 flex flex-col gap-5 py-5">
        <div>
          <p className="text-base">Name</p>
          <p className="text-xs">Role</p>
        </div>
        <div>
          <p className="text-sm">Dashboard</p>
          {NAVIGATION_ITEMS.map(({ name, to, icon }) => (
            <NavItem label={name} path={to} icon={icon} key={name} />
          ))}
        </div>
        <div>
          <p className="text-sm">User</p>
          {USER_ITEMS.map(({ name, to, icon }) => (
            <NavItem label={name} path={to} icon={icon} key={name} />
          ))}
        </div>
        <div>
          <p className="text-sm">Admin</p>
          {ADMIN_ITEMS.map(({ name, to, icon }) => (
            <NavItem label={name} path={to} icon={icon} key={name} />
          ))}
        </div>
      </div>
      <div className="text-white absolute bottom-5 left-5 text-base font-primary flex gap-3 hover:text-primary cursor-pointer font-medium"> <TbLogout2 size={20}/> Logout </div>
    </div>
  );
}
