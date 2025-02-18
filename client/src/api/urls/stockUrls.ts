export const ADD_STOCK = `/v1/stockIn`
export const GET_STOCK_LIST = (id: String) => `/v1//stockInList/${id}`
export const GET_ASSEMBLE_LIST_PER_ITEM = (id: String) =>
  `/v1///assembleList?itemId=${id}`
export const UPDATE_STOCK = (transactionNumber: String) =>
  `/v1//stockIn/${transactionNumber}`
export const ADD_STOCK_FOR_FINISHED_GOODS = `/v1/assemble`
export const UPDATE_ASSEMBLE_STOCK = (transactionNumber: String) =>
  `/v1//assemble/${transactionNumber}`
export const GET_ALL_STOCK_LIST = `/v1/stockInList`
