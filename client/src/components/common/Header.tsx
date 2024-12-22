import { IoIosNotifications } from "react-icons/io"
import { CiMenuBurger } from "react-icons/ci"
import { IoIosSettings } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { NavLink } from "react-router-dom"
import { useState } from "react"

const NAVIGATION_ITEMS = [
  { name: "Overview", to: "/overview" },
  { name: "Inventory", to: "/inventory" },
  { name: "Products", to: "/products" },
  { name: "Purchasing", to: "/purchasing" },
  { name: "Sales", to: "/sales" },
  { name: "Stocklist", to: "/stocklist" },
  { name: "Reports", to: "/reports" },
]

const Header = () => {
  const [menu, setMenu] = useState(false)

  const menuToggle = () => {
    setMenu(!menu)
  }

  return (
    <header className='relative flex justify-between items-center px-4 lg:px-8 py-4 border-gray-200 mx-auto max-w-full transition-all duration-300 ease-in-out'>
      <div className='hidden lg:block font-bold text-2xl text-red-900'>
        E&L Delicatessen
      </div>
      <div
        className='lg:hidden flex items-center cursor-pointer z-10'
        onClick={menuToggle}
      >
        <CiMenuBurger className='text-xl hover:text-red-900' />
      </div>
      <nav
        className={`${
          menu
            ? "block absolute top-[52px] left-0 w-full bg-[#FAFAFA]"
            : "hidden"
        } px-4 lg:px-6 py-2.5 lg:flex items-center justify-between  `}
      >
        <ul className='flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 gap-5'>
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold  border-red-900 "
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0 transition-colors`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className='flex gap-6 items-center cursor-pointer'>
        <IoIosNotifications className='text-xl hover:text-red-900' />
        <IoIosSettings className='text-xl hover:text-red-900' />
        <CgProfile className='text-xl hover:text-red-900' />
      </div>
    </header>
  )
}

export default Header
