import apiClient from "../../utils/apiClient"
import { ADD_STOCK } from "../urls/stockUrls"
import { StockType } from "../../type/StockType"

export const addStock = async (stock: StockType) => {
  const response = await apiClient.post(ADD_STOCK, stock)

  return response.data
}
