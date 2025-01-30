import apiClient from "../../utils/apiClient"
import {
  GET_ITEMS,
  GET_ITEMS_BY_CATEGORY_AND_STATUS,
  CREATE_ITEM,
  UPDATE_ITEM,
  GET_ITEM,
  CREATE_ITEM_COMPONENTS,
  CREATE_MULTIPLE_ITEMS,
} from "../urls/itemUrls"
import { ItemType, ProductWithComponents } from "../../type/itemType"

export const createItem = async (item: ItemType) => {
  const response = await apiClient.post(CREATE_ITEM, item)

  return response.data
}

export const createMultipleItems = async (item: ItemType[]) => {
  const response = await apiClient.post(CREATE_MULTIPLE_ITEMS, item)
  return response.data
}

export const updateItem = async (item: ItemType) => {
  const response = await apiClient.put(UPDATE_ITEM(item.code), item)

  return response.data
}

export const getItemList = async (): Promise<ItemType[]> => {
  const response = await apiClient.get(GET_ITEMS)

  return response.data
}

export const getItemListByCategoryRawMats = async (): Promise<ItemType[]> => {
  const response = await apiClient.get(
    GET_ITEMS_BY_CATEGORY_AND_STATUS("Raw Mats", "ACTIVE")
  )

  return response.data
}

export const getItemListByCategoryFinishedGoods = async (): Promise<
  ItemType[]
> => {
  const response = await apiClient.get(
    GET_ITEMS_BY_CATEGORY_AND_STATUS("Finished Goods", "ACTIVE")
  )

  return response.data
}

export const getItem = async (code: string): Promise<ItemType> => {
  const response = await apiClient.get(GET_ITEM(code))

  return response.data
}

export const createItemComponents = async (
  productComponents: ProductWithComponents
) => {
  const response = await apiClient.post(
    CREATE_ITEM_COMPONENTS,
    productComponents
  )

  return response.data
}
