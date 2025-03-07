export const GET_SALES_ORDER = "/v1/salesorderList"
export const CREATE_SALES_ORDER = "/v1/salesorder"
export const UPDATE_SALES_ORDER = (salesNumber: string) =>
  `/v1/salesorder/${salesNumber}`
export const GET_SALESORDER_BY_DATE_RANGE = (from: String, to: String) =>
  `/v1/salesorderList?fromDate=${from}&toDate=${to}`
export const GET_SALES_ORDER_PER_SALESNUMBER = (salesNumber: string) =>
  `/v1/salesorder?salesorderNo=${salesNumber}`
