import { SalesOrderType } from "../../type/salesType"
import {
  getSalesOrderList,
  createSalesOrder,
  updateSalesOrder,
} from "../../api/services/sales"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "../../utils/Toast"

const useSalesOrder = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery<SalesOrderType[]>({
    queryKey: ["salesOrder"],
    queryFn: getSalesOrderList,
  })

  const createSalesOrderMutation = useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["salesOrder"] })
      showToast.success("Successfully created new order")
    },
    onError: () => {
      let message = "Error creating new order"

      showToast.error(message)
    },
  })

  const updateSalesOrderMutation = useMutation({
    mutationFn: updateSalesOrder,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["salesOrder"] })
      showToast.success("Successfully updated new order")
    },
    onError: () => {
      let message = "Error updating order"

      showToast.error(message)
    },
  })

  return {
    data,
    isLoading,
    isError,
    createSalesOrder: createSalesOrderMutation.mutate,
    isPending: createSalesOrderMutation.isPending,
    updateSalesOrder: updateSalesOrderMutation.mutate,
    isUpdatePending: updateSalesOrderMutation.isPending,
  }
}

export default useSalesOrder
