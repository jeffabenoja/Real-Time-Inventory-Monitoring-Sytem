import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addStock } from "../../api/services/stock"
// import { StockType } from "../../type/StockType"
import { showToast } from "../../utils/Toast"

export const useAddStock = () => {
  const queryClient = useQueryClient()

  // Fetch Finished Goods
  //   const { data, isLoading, isError, error } = useQuery<StockType[]>({
  //     queryKey: ["Stock", "Raw Mats"],
  //     queryFn: getItemListByCategoryRawMats,
  //   })

  // Add New Item Mutation
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

  return {
    addStock: stockMutation.mutate,
    isPending: stockMutation.isPending,
  }
}
