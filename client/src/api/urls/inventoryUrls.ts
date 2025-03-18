export const GET_INVENTORY_PER_ITEM = (transactionNumber: String) =>
  `/v1/inventory/${transactionNumber}`
export const GET_INVENTORY_LIST_BY_CATEGORY = (category: String) =>
  `/v1/inventoryList?itemType=${category}`
export const GET_INVENTORY_LIST = "/v1/inventoryList"
export const GET_INVENTORY_STOCK_CARD = (itemId: String) =>
  `/v1/stockcard/${itemId}`
