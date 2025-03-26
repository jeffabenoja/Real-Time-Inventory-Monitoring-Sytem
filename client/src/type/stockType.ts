import { ItemType } from "./itemType"

export interface StockInType {
  transactionNo?: string
  transactionDate: string
  remarks: string
  item: {
    code: string
    description?: string
    id?: string
  }
  quantity: number
  expiryDate?: string
  returnQuantity?: number
  issuedQuantity?: number
  batchNo: string
  status?: string
  createdDateTime?: string
  createdBy?: string
}

export interface UpdateStockType {
  transactionNo?: string
  remarks: string
  quantity: number
  batchNo?: string
  expiryDate?: string
  status?: string
}

export interface AssembleStock {
  transactionNo?: string
  transactionDate?: string
  remarks: string
  finishProduct: ItemType
  expiryDate?: string
  quantity: number
  batchNo: string
  status?: string
}

export interface AssembleUpdateStock {
  transactionNo?: string
  transactionDate?: string
  remarks: string
  finishProduct: ItemType
  assembleQuantity: number
  expiryDate?: string
  batchNo: string
  status?: string
}

export interface AssembleTransaction {
  transactionNo: string
  transactionDate: string
  remarks: string
  finishProduct: ItemType
  assembleQuantity: number
  issuedQuantity?: number
  returnQuantity?: number
  expiryDate?: string
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

export interface StockCardType {
  itemId: string
  date: string
  transactionNo: string
  stockIn: number
  stockOut: number
  runningBalance: number
}

export interface StockOutListType {
  transactionNo: string
  transactionDate: string
  remarks: string
  stockIn: StockInType
  quantity: number
  batchNo: string
  status?: string
  createdDateTime?: string
  createdBy?: string
}

export interface StockOutType {
  transactionDate: string
  remarks: string
  item?: {
    code: string
  } | null
  stockIn?: {
    transactionNo: string
  } | null
  assemble?: {
    transactionNo: string
  } | null
  quantity: number
  batchNo?: string
}

export interface AddStockType {
  stock: StockInType
  usercode: string
  token: string
}

export interface AddAssembleStockType {
  assembleStock: AssembleStock
  usercode: string
  token: string
}

export interface StockOutTypeProps {
  stockToRemove: StockOutType
  usercode: string
  token: string
}