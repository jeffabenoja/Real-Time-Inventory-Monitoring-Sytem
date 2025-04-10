// Item API
export const CREATE_ITEM = `/v1/item`
export const GET_ITEMS = `/v1/itemList`
export const GET_ITEMS_BY_CATEGORY = (category: String) =>
  `/v1/itemList?category=${category}`
export const GET_ITEMS_BY_CATEGORY_AND_STATUS = (
  category: String,
  status: String
) => `/v1/itemList?category=${category}&status=${status}`
export const GET_ITEM = (itemCode: String) => `/v1/item?code=${itemCode}`
export const UPDATE_ITEM = (itemCode: String) => `/v1/item/${itemCode}`
export const CREATE_ITEM_COMPONENTS = `/v1/item-with-components`
export const CREATE_MULTIPLE_ITEMS = `/v1/items//mass-upload`
export const FETCH_ITEM_WITH_COMPONENTS = (id: string) =>
  `/v1/item-with-components/${id}`
export const UPDATE_ITEM_WITH_COMPONENTS = (id: string) =>
  `/v1/item-with-components/${id}`
