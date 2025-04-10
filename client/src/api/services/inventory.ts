import apiClient from "../../utils/apiClient"
import {
  InventoryPerItemType,
  InventoryPerCategory,
  StockCardType,
} from "../../type/stockType"
import {
  GET_INVENTORY_PER_ITEM,
  GET_INVENTORY_LIST_BY_CATEGORY,
  GET_INVENTORY_STOCK_CARD,
  GET_INVENTORY_LIST,
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

export const getInventoryList = async (): Promise<InventoryPerItemType[]> => {
  const response = await apiClient.get(GET_INVENTORY_LIST)

  return response.data
}

export const getInventoryStockCard = async (
  itemId: string
): Promise<StockCardType[]> => {
  const response = await apiClient.get(GET_INVENTORY_STOCK_CARD(itemId))

  return response.data
}
