import apiClient from "../../utils/apiClient"
import {
  GET_SALES_ORDER,
  CREATE_SALES_ORDER,
  UPDATE_SALES_ORDER,
} from "../urls/salesOrderUrls"
import { SalesOrderType, SalesOrderCreateType } from "../../type/salesType"

export const getSalesOrderList = async (): Promise<SalesOrderType[]> => {
  const response = await apiClient.get(GET_SALES_ORDER)

  return response.data
}

export const createSalesOrder = async (item: SalesOrderCreateType) => {
  const response = await apiClient.post(CREATE_SALES_ORDER, item)

  return response.data
}

export const updateSalesOrder = async (salesOrder: SalesOrderCreateType) => {
  const response = await apiClient.put(
    UPDATE_SALES_ORDER(salesOrder.salesorderNo || ""),
    salesOrder
  )

  return response.data
}
