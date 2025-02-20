import { createSalesOrder } from "../../api/services/sales"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "../../utils/Toast"

const useCreateSalesOrder = () => {
  const queryClient = useQueryClient()

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

  return {
    createSalesOrder: createSalesOrderMutation.mutate,
    isPending: createSalesOrderMutation.isPending,
  }
}

export default useCreateSalesOrder
