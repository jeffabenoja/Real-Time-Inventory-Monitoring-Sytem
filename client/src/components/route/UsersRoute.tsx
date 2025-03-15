import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { RootState } from "../../store"
import { InventoryPerItemType } from "../../type/stockType"
import { useQuery } from "@tanstack/react-query"
import { getInventoryList } from "../../api/services/inventory"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { initialInventory } from "../../store/slices/inventory"
import { useEffect } from "react"

const UsersRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const { data: inventoryData = [], isSuccess } = useQuery<
    InventoryPerItemType[]
  >({
    queryKey: ["Stock", "StockOut", "Raw Mats", "Finished Goods"],
    queryFn: () => getInventoryList(),
  })

  useEffect(() => {
    if (user && isSuccess) {
      dispatch(initialInventory(inventoryData))
    }
  }, [dispatch, isSuccess, user, inventoryData])

  return user ? <Outlet /> : <Navigate to='/login' />
}

export default UsersRoute
