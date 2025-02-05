import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addStock, addStockForFinishedGoods } from "../../api/services/stock"
import { showToast } from "../../utils/Toast"

// Type Guard to check if error is an AxiosError

export const useAddStock = () => {
  const queryClient = useQueryClient()

  const stockMutation = useMutation({
    mutationFn: addStock,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Raw Mats"] })
      showToast.success("Successfully added new stock")
    },
    onError: () => {
      let message = "Error adding stock for this item"

      showToast.error(message)
    },
  })

  const addStockMutation = useMutation({
    mutationFn: addStockForFinishedGoods,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Finished Goods"] })
      showToast.success("Successfully added new stock")
    },
    onError: () => {
      let message = "Insufficient stock for raw materials"

      showToast.error(message)
    },
  })

  return {
    addStock: stockMutation.mutate,
    isPending: stockMutation.isPending,
    addStockFinishGoods: addStockMutation.mutate,
    isPendingFinishedGoods: addStockMutation.isPending,
  }
}
