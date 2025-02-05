import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface Props {
  label: string;
  path: string;
  icon: IconType;
}

export default function NavItem({ label, path, icon: Icon }: Props) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 font-heading py-2 ${
          isActive ? "text-primary font-bold" : "text-white hover:text-primary"
        }`
      }
    >
      <Icon size={20} />
      <span className="text-base">{label}</span>
    </NavLink>
  );
}