// Item API
export const POST_ITEM = `/v1/item`
export const GET_ITEMS = `/v1/itemList`
export const GET_ITEMS_BY_CATEGORY = (category: String) => `/v1/itemList?category=${category}`
export const GET_ITEM = (itemCode: String) => `/v1/item?code=${itemCode}`
