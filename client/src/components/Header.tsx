import { IoIosNotifications } from "react-icons/io"
import { CiMenuBurger } from "react-icons/ci"
import { IoIosSettings } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { NavLink } from "react-router-dom"
import { useState } from "react"

const Header = () => {
  const [menu, setMenu] = useState(false)

  const menuToggle = () => {
    setMenu(!menu)
  }

  console.log(menu)

  return (
    <header className='relative flex justify-between items-center px-4 lg:px-8 py-4 border-gray-200 mx-auto max-w-full'>
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
          <li>
            <NavLink
              to='/dashboard/overview'
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold  border-red-900 "
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/inventory'
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold border-red-900"
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0`
              }
            >
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/products'
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold border-red-900"
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0`
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/purchasing'
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold border-red-900"
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0`
              }
            >
              Purchasing
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/sales'
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold border-red-900"
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0`
              }
            >
              Sales
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/stocklist'
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold border-red-900"
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0`
              }
            >
              Stocklist
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/reports'
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${
                                          isActive
                                            ? "text-red-900 font-bold border-red-900"
                                            : "text-gray-700 lg:border-0"
                                        } lg:hover:bg-transparent hover:text-red-900 lg:py-0`
              }
            >
              Reports
            </NavLink>
          </li>
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
