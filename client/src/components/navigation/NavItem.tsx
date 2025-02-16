import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface Props {
  label: string;
  path: string;
  icon: IconType;
  clicked: () => void
}

export default function NavItem({ label, path, icon: Icon, clicked }: Props) {
  return (
    <NavLink
      to={path}
      onClick={clicked}
      className={({ isActive }) =>
        `flex items-center gap-3 font-heading py-2 hover:font-semibold ${
          isActive ? "font-semibold text-secondary" : ""  
        }`
      }
    >
      <Icon size={20} />
      <span className="text-base">{label}</span>
    </NavLink>
  );
}