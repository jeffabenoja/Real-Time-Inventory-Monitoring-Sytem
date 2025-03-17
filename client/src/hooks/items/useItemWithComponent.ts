import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchItemWithComponents,
  updateItemWithComponents,
} from "../../api/services/item"
import { FetchedItem } from "../../utils/transformItemWithComponents"
import { showToast } from "../../utils/Toast"

export const useItemWithComponents = (id: string) => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery<FetchedItem>({
    queryKey: ["ItemWithComponents", "Finished Goods"],
    queryFn: () => fetchItemWithComponents(id),
  })

  const updateItemMutation = useMutation({
    mutationFn: updateItemWithComponents,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({
        queryKey: ["ItemWithComponents", "Finished Goods"],
      })
      showToast.success("Successfully updated the item")
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Error updating the item"
      showToast.error(message)
    },
  })

  return {
    data,
    isLoading,
    isError,
    updateItem: updateItemMutation.mutate,
    isPending: updateItemMutation.isPending,
  }
}
