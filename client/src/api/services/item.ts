import apiClient from "../../utils/apiClient"
import {
  GET_ITEMS,
  GET_ITEMS_BY_CATEGORY_AND_STATUS,
  CREATE_ITEM,
  UPDATE_ITEM,
  GET_ITEM,
  CREATE_ITEM_COMPONENTS,
  CREATE_MULTIPLE_ITEMS,
  FETCH_ITEM_WITH_COMPONENTS,
  UPDATE_ITEM_WITH_COMPONENTS,
} from "../urls/itemUrls"
import { ItemType, ProductWithComponents } from "../../type/itemType"
import {
  FetchedItem,
  TransformedItem,
} from "../../utils/transformItemWithComponents"
import transformItemWithComponents from "../../utils/transformItemWithComponents"

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

export const fetchItemWithComponents = async (
  id: string
): Promise<FetchedItem> => {
  const response = await apiClient.get(FETCH_ITEM_WITH_COMPONENTS(id))

  return response.data
}

export const fetchMultipleItemWithComponents = async (
  ids: string[]
): Promise<Record<string, TransformedItem>> => {
  const items = await Promise.all(ids.map((id) => fetchItemWithComponents(id)))

  const combinedItems = items.reduce(
    (acc: Record<string, TransformedItem>, item, index) => {
      const transformed = transformItemWithComponents(item)
      if (transformed) {
        acc[ids[index]] = transformed
      }
      return acc
    },
    {}
  )

  return combinedItems
}

export const updateItemWithComponents = async ({
  id,
  updateProductComponent,
}: {
  id: string
  updateProductComponent: any
}) => {
  const response = await apiClient.put(
    UPDATE_ITEM_WITH_COMPONENTS(id),
    updateProductComponent
  )

  return response.data
}
