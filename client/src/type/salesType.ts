import { ItemType } from "./itemType"

export interface itemDetailType {
  id: string
  item: ItemType
  orderQuantity: number
  itemPrice: number
  amount: number
}

export interface DetailsType {
  id: number
  item: itemDetailType
  orderQuantity: number
  itemPrice: number
  amount: number
}

export interface CustomerType {
  id: string
  name: string
  address: string
  contactPerson: string
  contactNumber: string
  status: string
}

export interface SalesOrderType {
  salesorderNo: string
  orderDate: string
  remarks: string
  customer: CustomerType
  status: string
  createdDateTime: string
  details: DetailsType[]
}

export interface SalesOrderCreateType {
  orderDate: string
  remarks: string
  customer: {
    id: string
  }
  details: {
    item: {
      id: string
      code: string
    }
    orderQuantity: string
    itemPrice: string
  }[]
}
