import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addStock, addStockForFinishedGoods } from "../../api/services/stock"

import { showToast } from "../../utils/Toast"

export const useAddStock = () => {
  const queryClient = useQueryClient()

  const stockMutation = useMutation({
    mutationFn: addStock,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Raw Mats"] })
      showToast.success("Successfully added new stock")
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Error adding new item"
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
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Error adding new item"
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
