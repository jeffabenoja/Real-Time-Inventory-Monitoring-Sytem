import { Outlet } from "react-router-dom"
import Header from "../components/common/Header"

const MainLayout = () => {
  return (
    <>
    <Header />
    <div className="mx-4 lg:mx-8 my-4">
      <Outlet />
    </div>
    </>
  )
}

export default MainLayout
