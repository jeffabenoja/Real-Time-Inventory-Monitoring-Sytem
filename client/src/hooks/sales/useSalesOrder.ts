import { SalesOrderType } from "../../type/salesType"
import { getSalesOrderListByDateRange } from "../../api/services/sales"
import { useQuery } from "@tanstack/react-query"

const useSalesOrder = ({ from, to }: { from: string; to: string }) => {
  const { data, isLoading, isError } = useQuery<SalesOrderType[]>({
    queryKey: ["salesOrder"],
    queryFn: () => getSalesOrderListByDateRange({ from, to }),
  })

  return {
    data,
    isLoading,
    isError,
  }
}

export default useSalesOrder
