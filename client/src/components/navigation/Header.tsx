import { HiOutlineMenu } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { RiRobot2Line } from "react-icons/ri";

interface Props {
  handleSidebar: () => void;
}

export default function Header({ handleSidebar }: Props) {
  const navigate = useNavigate();

  const logoHandler = () => navigate("/dashboard/overview");

  return (
    <>
      <header className="flex justify-between items-center shadow-md border-gray-200 w-full p-4 sticky top-0 z-30 bg-white">
        <div className="flex flex-1 font-heading items-center justify-between lg:justify-end">
          <h2
            className="text-base flex items-center gap-1 lg:hidden text-primary cursor-pointer font-heading"
            onClick={logoHandler}
          >
            E&L DELICATESSEN
          </h2>
          <div className="flex gap-5 items-center">
            <div className="cursor-pointer">
              <NavLink to="/prediction" className="relative">
                <RiRobot2Line size={30} />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  AI
                </span>
              </NavLink>
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
