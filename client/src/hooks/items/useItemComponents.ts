import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getItemList, createItem, updateItem } from "../../api/services/item"
import { ItemType } from "../../type/itemType"
import { showToast } from "../../utils/Toast"

export const useItemComponents = () => {
  const queryClient = useQueryClient()

  // Fetch Finished Goods
  const { data, isLoading, isError, error } = useQuery<ItemType[]>({
    queryKey: ["Item", "Finished Goods"],
    queryFn: getItemList,
  })

  // Add New Item Mutation
  const itemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Item", "Finished Goods"] })
      showToast.success("Successfully added new item")
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Error adding new item"
      showToast.error(message)
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Item", "Finished Goods"] })
      showToast.success("Successfully added new item")
      showToast.success("Updated item successfully")
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
    error,
    createItem: itemMutation.mutate,
    isPending: itemMutation.isPending,
    updateItem: updateItemMutation.mutate,
    isPendingUpdate: updateItemMutation.isPending,
  }
}
