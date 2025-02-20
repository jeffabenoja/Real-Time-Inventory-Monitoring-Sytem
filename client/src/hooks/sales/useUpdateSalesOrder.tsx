import { updateSalesOrder } from "../../api/services/sales"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "../../utils/Toast"

const useUpdateSalesOrder = () => {
  const queryClient = useQueryClient()

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
    updateSalesOrder: updateSalesOrderMutation.mutate,
    isUpdatePending: updateSalesOrderMutation.isPending,
  }
}

export default useUpdateSalesOrder
