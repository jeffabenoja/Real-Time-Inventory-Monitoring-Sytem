import apiClient from "../../utils/apiClient"
import { GET_ITEMS, GET_ITEMS_BY_CATEGORY } from "../urls/itemUrls"
import { ItemType } from "../../type/itemType"

export const getItemList = async (): Promise<ItemType[]> => {
  const response = await apiClient.get(GET_ITEMS)

  return response.data
}

export const getItemListByCategoryRawMats = async (): Promise<ItemType[]> => {
  const response = await apiClient.get(GET_ITEMS_BY_CATEGORY("Raw Mats"))

  return response.data
}

export const getItemListByCategoryFinishedGoods = async (): Promise<
  ItemType[]
> => {
  const response = await apiClient.get(GET_ITEMS_BY_CATEGORY("Finished Goods"))

  return response.data
}
