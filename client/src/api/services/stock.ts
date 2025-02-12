import apiClient from "../../utils/apiClient"
import {
  ADD_STOCK,
  GET_STOCK_LIST,
  UPDATE_STOCK,
  ADD_STOCK_FOR_FINISHED_GOODS,
  GET_ASSEMBLE_LIST_PER_ITEM,
} from "../urls/stockUrls"
import {
  StockInType,
  StockListType,
  AssembleStock,
  UpdateStockType,
} from "../../type/stockType"

export const addStock = async (stock: StockInType) => {
  const response = await apiClient.post(ADD_STOCK, stock, {
    headers: {
      usercode: "alonica",
      token: "aab4decf189d4db3cb6b74471afd5b7e",
      "Content-Type": "application/json",
    },
  })

  return response.data
}

export const addStockForFinishedGoods = async (stock: AssembleStock) => {
  const response = await apiClient.post(ADD_STOCK_FOR_FINISHED_GOODS, stock)

  return response.data
}

export const getStockListPerItem = async (
  id: string
): Promise<StockListType[]> => {
  const response = await apiClient.get(GET_STOCK_LIST(id))

  return response.data
}

export const getAssemblePerItem = async (
  id: string
): Promise<AssembleStock[]> => {
  const response = await apiClient.get(GET_ASSEMBLE_LIST_PER_ITEM(id))

  return response.data
}

export const updateStock = async (item: UpdateStockType) => {
  if (!item.transactionNo) {
    throw new Error("Transaction number is required")
  }

  const response = await apiClient.put(UPDATE_STOCK(item.transactionNo), item)

  return response.data
}
