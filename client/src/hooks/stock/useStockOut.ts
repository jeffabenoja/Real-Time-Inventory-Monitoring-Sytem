import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { updateStockOut, getStockOutList } from "../../api/services/stock"
import { showToast } from "../../utils/Toast"
import { StockListType } from "../../type/stockType"

interface StockOutProps {
  from: string
  to: string
}

export const useStockOut = ({ from, to }: StockOutProps) => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery<StockListType[]>({
    queryKey: ["StockOut", "Raw Mats"],
    queryFn: () =>
      getStockOutList({
        from: from,
        to: to,
      }),
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
  }
}
