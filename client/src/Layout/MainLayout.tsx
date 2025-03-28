import { Outlet } from "react-router-dom"
import Header from "../components/navigation/Header"
import { useState } from "react"
import Sidebar from "../components/navigation/Sidebar"

const MainLayout = () => {
  const [sidebar, setSidebar] = useState(false)

  const menuToggle = () => {
    setSidebar(!sidebar)
  }

  return (
    <div className='relative'>
      <Header
        handleSidebar={menuToggle}
      />
      {sidebar && <Sidebar close={menuToggle} />}
      <div className='hidden lg:block w-60 lg:w-64'>
        <Sidebar />
      </div>
      <div className={`lg:ml-64 ${sidebar ? "overflow-hidden" : ""}`}>
        <div className='flex flex-col max-w-full mx-auto h-dynamic-sm lg:h-dynamic-lg px-4 lg:px-8 py-4 z-0 xl:overflow-auto scrollbar'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
