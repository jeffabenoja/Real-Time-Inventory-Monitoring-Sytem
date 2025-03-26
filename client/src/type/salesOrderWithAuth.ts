import { SalesOrderCreateType } from "./salesType"

interface CreateSalesOrderTypeWithAuth {
  salesOrder: SalesOrderCreateType
  usercode: string
  token: string
}

export default CreateSalesOrderTypeWithAuth