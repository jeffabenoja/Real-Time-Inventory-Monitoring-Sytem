import { SalesOrderType } from "../../type/salesType"
import { getSalesOrderList } from "../../api/services/sales"
import { useQuery } from "@tanstack/react-query"

const useSalesOrder = () => {
  const { data, isLoading, isError } = useQuery<SalesOrderType[]>({
    queryKey: ["salesOrder"],
    queryFn: getSalesOrderList,
  })
  return {
    data,
    isLoading,
    isError,
  }
}

export default useSalesOrder
