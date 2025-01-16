import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { RootState } from "../../store"

const UsersRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return user ? <Outlet /> : <Navigate to='/login' />
}

export default UsersRoute
