import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { updateStockOut, getStockOutPerItem } from "../../api/services/stock"
import { showToast } from "../../utils/Toast"
import { StockListType } from "../../type/stockType"

interface StockOutProps {
  id: string
}

export const useStockOut = ({ id }: StockOutProps) => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery<StockListType[]>({
    queryKey: ["StockOut", "Raw Mats"],
    queryFn: () => getStockOutPerItem(id),
    enabled: !!id,
  })

  const stockMutation = useMutation({
    mutationFn: updateStockOut,
    onSuccess: () => {
      // Refetch the list of items
      
      queryClient.invalidateQueries({ queryKey: ["StockOut", "Raw Mats"] })
      
      showToast.success("Successfully updated stockout status")
    },
    onError: () => {
      showToast.error("Error updating stockout")
    },
  })

  return {
    data,
    isLoading,
    isError,
    updateStockOut: stockMutation.mutate,
    isPending: stockMutation.isPending,
    isSuccess: stockMutation.isSuccess,
  }
}
