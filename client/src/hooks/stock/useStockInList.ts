import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getStockListPerItem, updateStock } from "../../api/services/stock"
import { StockListType } from "../../type/stockType"
import { showToast } from "../../utils/Toast"

export const useStockInList = (id: string) => {
  const queryClient = useQueryClient()
  // Fetch Finished Goods
  const { data, isLoading, isError } = useQuery<StockListType[]>({
    queryKey: ["Stock", "Raw Mats"],
    queryFn: () => getStockListPerItem(id),
    retry: 0,
    enabled: !!id,
  })

  const updateStockMutation = useMutation({
    mutationFn: updateStock,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Raw Mats"] })
      showToast.success("Successfully updated stock transaction ")
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Error updating transaction"
      showToast.error(message)
    },
  })

  return {
    data,
    isLoading,
    isError,
    updateStock: updateStockMutation.mutate,
    isPending: updateStockMutation.isPending,
  }
}
