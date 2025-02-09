export const GET_SALES_ORDER = "/v1/salesorderList"
export const CREATE_SALES_ORDER = "/v1/salesorder"
export const UPDATE_SALES_ORDER = (salesNumber: string) =>
  `/v1/salesorder/${salesNumber}`
