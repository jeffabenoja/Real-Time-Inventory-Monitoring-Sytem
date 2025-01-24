export interface StockType {
  transactionDate: string
  remarks: string
  item: {
    code: string
  }
  quantity: number
}
