import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStockAssemble } from "../../api/services/stock"
import { showToast } from "../../utils/Toast"

export const useUpdateAssemble = () => {
  const queryClient = useQueryClient()

  const updateStockMutation = useMutation({
    mutationFn: updateStockAssemble,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Stock", "Assemble"] })
      showToast.success("Successfully updated assemble transaction")
    },
    onError: (error) => {
      console.log(error)
      const message =
        error instanceof Error ? error.message : "Error updating transaction"
      showToast.error(message)
    },
  })

  return {
    updateAssembleStock: updateStockMutation.mutate,
    isPending: updateStockMutation.isPending,
  }
}
