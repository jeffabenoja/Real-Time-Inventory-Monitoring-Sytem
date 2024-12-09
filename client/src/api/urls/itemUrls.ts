const API = "/api"
// Item API
export const ITEM_POST = `${API}/v1/item`
export const ITEM_LIST = `${API}/v1/itemList`
export const ITEM = (itemCode: String) => `${API}/v1/item?code=${itemCode}`
