import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { RootState } from "../../store"
import NotAuthorized from "../common/utils/NotAuthorized"

const AdminRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return user && user?.userGroup?.isAdmin ? <Outlet /> : <NotAuthorized />
}

export default AdminRoute
