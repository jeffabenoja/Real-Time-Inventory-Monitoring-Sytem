import apiClient from "../../utils/apiClient"
import {
  InventoryPerItemType,
  InventoryPerCategory,
} from "../../type/stockType"
import {
  GET_INVENTORY_PER_ITEM,
  GET_INVENTORY_LIST_BY_CATEGORY,
} from "../urls/inventoryUrls"

export const getInventoryPerItem = async (
  id: string
): Promise<InventoryPerItemType> => {
  const response = await apiClient.get(GET_INVENTORY_PER_ITEM(id))

  return response.data
}

export const getInventoryByCategory = async (
  category: string
): Promise<InventoryPerCategory[]> => {
  const response = await apiClient.get(GET_INVENTORY_LIST_BY_CATEGORY(category))

  return response.data
}
