import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getItemListByCategoryRawMats,
  createItem,
} from "../../api/services/item"
import { ItemType } from "../../type/itemType"
import { showToast } from "../../utils/Toast"

export const useItemMaterials = () => {
  const queryClient = useQueryClient()

  // Fetch Finished Goods
  const { data, isLoading, isError, error } = useQuery<ItemType[]>({
    queryKey: ["Raw Mats"],
    queryFn: getItemListByCategoryRawMats,
  })

  // Add New Item Mutation
  const itemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // Refetch the list of items
      queryClient.invalidateQueries({ queryKey: ["Raw Mats"] })
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Error adding new item"
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
  }
}
