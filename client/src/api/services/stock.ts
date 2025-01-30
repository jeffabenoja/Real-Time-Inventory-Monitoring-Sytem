import apiClient from "../../utils/apiClient"
import {
  ADD_STOCK,
  GET_STOCK_LIST,
  UPDATE_STOCK,
  ADD_STOCK_FOR_FINISHED_GOODS,
} from "../urls/stockUrls"
import {
  StockInType,
  StockListType,
  UpdateStockType,
} from "../../type/StockType"

export const addStock = async (stock: StockInType) => {
  const response = await apiClient.post(ADD_STOCK, stock)

  return response.data
}

export const addStockForFinishedGoods = async (stock: StockInType) => {
  const response = await apiClient.post(ADD_STOCK_FOR_FINISHED_GOODS, stock)

  return response.data
}

export const getStockListPerItem = async (
  id: string
): Promise<StockListType[]> => {
  const response = await apiClient.get(GET_STOCK_LIST(id))

  return response.data
}

export const updateStock = async (item: UpdateStockType) => {
  if (!item.transactionNo) {
    throw new Error("Transaction number is required")
  }

  const response = await apiClient.put(UPDATE_STOCK(item.transactionNo), item)

  return response.data
}
