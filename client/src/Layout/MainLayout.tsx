import { Outlet } from "react-router-dom"
import Header from "../components/common/Header"


const MainLayout = () => {
  return (
    <> 
      <Header />
      <div className="lg:ml-64">
        <Outlet/>
      </div>
      
    </>
  )
}

export default MainLayout
