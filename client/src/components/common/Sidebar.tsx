import { ReactNode, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IconType } from "react-icons";

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

interface Button {
  label: string;
  icon: IconType;
  path?: string;
  clicked?: () => void;
}

interface Props {
  navItems?: NavItem[];
  button?: Button;
  children: ReactNode;
}

export default function Sidebar({ navItems, button, children }: Props) {
  const navigate = useNavigate();
  const [sidebarOpen, setIsSidebarOpen] = useState(false);

  const buttonHandler = () => {
    if (button?.path) {
      navigate(button.path);
    } else {
      button?.clicked?.();
    }
  };

  return (
    <div className="relative">
      {!sidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden absolute left-3 top-3"
        >
          <CiMenuBurger size={20} />
        </div>
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-200 z-10 opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      {sidebarOpen && (
        <div className="lg:hidden fixed flex flex-col justify-between bg-white w-60 h-screen z-20 p-5">
          <div className="flex flex-col gap-7">
            <h2 className="text-center text-2xl">E&L Delicatessen</h2>
            <div className="text-lg flex flex-col gap-3">
              {navItems &&
                navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 ${isActive ? "font-bold" : ""}`
                    }
                  >
                    {<item.icon />}
                    {item.label}
                  </NavLink>
                ))}
            </div>
          </div>
          {button && (
            <button
              className="text-lg flex items-center gap-2"
              onClick={buttonHandler}
            >
              <IoMdArrowRoundBack />
              Dashboard
            </button>
          )}
        </div>
      )}

      <div className="hidden lg:fixed lg:flex lg:flex-col lg:justify-between bg-white lg:w-72 lg:h-screen p-8">
        <div className="flex flex-col gap-7">
          <h2 className="text-center text-2xl">E&L Delicatessen</h2>
          <div className="text-lg flex flex-col gap-3">
            {navItems &&
              navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? "font-bold" : ""}`
                  }
                >
                  {<item.icon />}
                  {item.label}
                </NavLink>
              ))}
          </div>
        </div>
        {button && (
          <button
            className="text-lg flex items-center gap-2"
            onClick={buttonHandler}
          >
            <IoMdArrowRoundBack />
            Dashboard
          </button>
        )}
      </div>

      <div className="lg:ml-80 lg:mr-10 lg:py-10">{children}</div>
    </div>
  );
}
