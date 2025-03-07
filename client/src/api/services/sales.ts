import apiClient from "../../utils/apiClient"
import {
  GET_SALES_ORDER,
  CREATE_SALES_ORDER,
  UPDATE_SALES_ORDER,
  GET_SALESORDER_BY_DATE_RANGE,
  GET_SALES_ORDER_PER_SALESNUMBER,
} from "../urls/salesOrderUrls"
import { SalesOrderType, SalesOrderCreateType } from "../../type/salesType"

interface CreateSalesOrderTypeWithAuth {
  salesOrder: SalesOrderCreateType
  usercode: string
  token: string
}

export const getSalesOrderPerNumber = async (
  salesNumber: string
): Promise<SalesOrderType> => {
  const response = await apiClient.get(
    GET_SALES_ORDER_PER_SALESNUMBER(salesNumber)
  )

  return response.data
}
export const getSalesOrderList = async (): Promise<SalesOrderType[]> => {
  const response = await apiClient.get(GET_SALES_ORDER)

  return response.data
}

export const getSalesOrderListByDateRange = async ({
  from,
  to,
}: {
  from: string
  to: string
}): Promise<SalesOrderType[]> => {
  const response = await apiClient.get(GET_SALESORDER_BY_DATE_RANGE(from, to))
  return response.data
}

export const createSalesOrder = async ({
  salesOrder,
  usercode,
  token,
}: CreateSalesOrderTypeWithAuth) => {
  const response = await apiClient.post(CREATE_SALES_ORDER, salesOrder, {
    headers: {
      usercode: usercode,
      token: token,
      "Content-Type": "application/json",
    },
  })

  return response.data
}

export const updateSalesOrder = async (salesOrder: SalesOrderCreateType) => {
  const response = await apiClient.put(
    UPDATE_SALES_ORDER(salesOrder.salesorderNo || ""),
    salesOrder
  )

  return response.data
}
