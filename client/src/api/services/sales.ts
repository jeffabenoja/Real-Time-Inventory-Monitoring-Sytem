import apiClient from "../../utils/apiClient"
import { GET_SALES_ORDER } from "../urls/salesOrderUrls"
import { SalesOrderType } from "../../type/salesType"

export const getSalesOrderList = async (): Promise<SalesOrderType[]> => {
  const response = await apiClient.get(GET_SALES_ORDER)

  return response.data
}
