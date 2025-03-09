import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAssemblePerItem } from "../../api/services/stock"
import { AssembleStock } from "../../type/stockType"
import { updateStockAssemble } from "../../api/services/stock"
import { showToast } from "../../utils/Toast"


export const useAssembleList = (id: string) => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery<AssembleStock[]>({
    queryKey: ["Stock", "Assemble"],
    queryFn: () => getAssemblePerItem(id),
    retry: 0,
    enabled: !!id,
  })

  const updateStockMutation = useMutation({
    mutationFn: updateStockAssemble,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Assemble"] })
      showToast.success("Successfully updated assemble transaction")
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
    updateAssembleStock: updateStockMutation.mutate,
    isPending: updateStockMutation.isPending,
  }
}
