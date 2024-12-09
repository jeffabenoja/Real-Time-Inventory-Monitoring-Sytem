/**
 * Definitions of ENDPOINT URLs used for API calls
 * */

const API = "/api"

// User API
export const USER_POST = `${API}/v1/user`
export const USER_LIST = `${API}/v1/userList`
export const USER_GROUP = `${API}/v1/usergroup`
export const USER_GROUP_LIST = (code: String) =>
  `${API}/v1/usergroup?code=${code}`
export const USER = (userCode: String) => `${API}/v1/user?usercode=${userCode}`

// Supplier API
export const SUPPLIER_POST = `${API}/v1/supplier`
export const SUPPLIER_LIST = `${API}/v1/supplierList`
export const SUPPLIER = (supplierCode: String) =>
  `${API}/v1/supplier?code=${supplierCode}`

// Item API
export const ITEM_POST = `${API}/v1/item`
export const ITEM_LIST = `${API}/v1/itemList`
export const ITEM = (itemCode: String) => `${API}/v1/item?code=${itemCode}`
