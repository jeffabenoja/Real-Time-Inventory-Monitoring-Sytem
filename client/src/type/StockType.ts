import { ItemType } from "./itemType"

export interface StockInType {
  transactionNo?: string
  transactionDate: string
  remarks: string
  item: {
    code: string
  }
  quantity: number
  batchNo: string
  status?: string
  createdDateTime?: string,
  createdBy?: string
}

export interface UpdateStockType {
  transactionNo?: string
  remarks: string
  quantity: number
  batchNo: string
  status?: string
}

export interface AssembleStock {
  transactionDate?: string
  remarks: string
  finishProduct: ItemType
  quantity: number
  batchNo: string
  status?: string
}

export interface AssembleTransaction {
  transactionNo: string
  transactionDate: string
  remarks: string
  finishProduct: ItemType
  assemble_quantity: number
  batchNo: string
  status: string
  createdDateTime: string
}

export interface StockListType {
  transactionNo: string
  transactionDate: string
  remarks: string
  item: ItemType
  quantity: number
  batchNo: string
  status: string
  createdBy: string
  createdDateTime: string
  id: number
}

export interface InventoryPerItemType {
  item: ItemType
  id: string
  inQuantity: number
  outQuantity: number
}

export interface InventoryPerCategory {
  item: ItemType
  id: string
  itemType: string
  inQuantity: number
  outQuantity: number
}
