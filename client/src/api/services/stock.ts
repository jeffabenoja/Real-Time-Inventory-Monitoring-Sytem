import apiClient from "../../utils/apiClient"
import {
  ADD_STOCK,
  GET_STOCK_LIST,
  GET_ALL_STOCK_LIST,
  UPDATE_STOCK,
  UPDATE_STOCKOUT,
  GET_ASSEMBLE_LIST,
  ADD_STOCK_FOR_FINISHED_GOODS,
  GET_ALL_STOCKOUT_LIST,
  GET_ASSEMBLE_LIST_PER_ITEM,
  UPDATE_ASSEMBLE_STOCK,
  GET_STOCKIN_BY_DATE_RANGE,
  STOCKOUT,
  STOCKOUT_FINISHED_PRODUCT,
  GET_STOCKOUT_PER_ITEM,
  GET_STOCKIOUT_BY_DATE_RANGE,
} from "../urls/stockUrls"
import {
  StockListType,
  AssembleStock,
  StockOutListType,
  UpdateStockType,
  AssembleUpdateStock,
  AddStockType,
  AddAssembleStockType,
  StockOutTypeProps
} from "../../type/stockType"

export const addStock = async ({ stock, usercode, token }: AddStockType) => {
  const response = await apiClient.post(ADD_STOCK, stock, {
    headers: {
      usercode: usercode,
      token: token,
      "Content-Type": "application/json",
    },
  })

  return response.data
}

export const stockOuts = async ({
  stockToRemove,
  usercode,
  token,
}: StockOutTypeProps) => {
  const response = await apiClient.post(STOCKOUT, stockToRemove, {
    headers: {
      usercode: usercode,
      token: token,
      "Content-Type": "application/json",
    },
  })

  return response.data
}

export const stockOutsAssemble = async ({
  stockToRemove,
  usercode,
  token,
}: StockOutTypeProps) => {
  const response = await apiClient.post(
    STOCKOUT_FINISHED_PRODUCT,
    stockToRemove,
    {
      headers: {
        usercode: usercode,
        token: token,
        "Content-Type": "application/json",
      },
    }
  )

  return response.data
}

export const addStockForFinishedGoods = async ({
  assembleStock,
  usercode,
  token,
}: AddAssembleStockType) => {
  const response = await apiClient.post(
    ADD_STOCK_FOR_FINISHED_GOODS,
    assembleStock,
    {
      headers: {
        usercode: usercode,
        token: token,
        "Content-Type": "application/json",
      },
    }
  )

  return response.data
}

export const getStockList = async (): Promise<StockListType[]> => {
  const response = await apiClient.get(GET_ALL_STOCK_LIST)

  return response.data
}

export const getAllStockOutList = async (): Promise<StockOutListType[]> => {
  const response = await apiClient.get(GET_ALL_STOCKOUT_LIST)

  return response.data
}

export const getStockListByDateRange = async ({
  from,
  to,
}: {
  from: string
  to: string
}): Promise<StockListType[]> => {
  const response = await apiClient.get(GET_STOCKIN_BY_DATE_RANGE(from, to))
  return response.data
}

export const getStockOutList = async ({
  from,
  to,
}: {
  from: string
  to: string
}): Promise<StockListType[]> => {
  const response = await apiClient.get(GET_STOCKIOUT_BY_DATE_RANGE(from, to))
  return response.data
}

export const getStockOutPerItem = async (id: string) => {
  const response = await apiClient.get(GET_STOCKOUT_PER_ITEM(id))
  return response.data
}

export const getStockListPerItem = async (
  id: string
): Promise<StockListType[]> => {
  const response = await apiClient.get(GET_STOCK_LIST(id))

  return response.data
}

export const getAssembleList = async (): Promise<AssembleStock[]> => {
  const response = await apiClient.get(GET_ASSEMBLE_LIST)

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

export const updateStockOut = async (item: UpdateStockType) => {
  if (!item.transactionNo) {
    throw new Error("Transaction number is required")
  }

  const response = await apiClient.put(
    UPDATE_STOCKOUT(item.transactionNo),
    item
  )

  return response.data
}

export const updateStockAssemble = async (stock: AssembleUpdateStock) => {
  if (!stock.transactionNo) {
    throw new Error("Transaction number is required")
  }

  const response = await apiClient.put(
    UPDATE_ASSEMBLE_STOCK(stock.transactionNo),
    stock
  )

  return response.data
}
