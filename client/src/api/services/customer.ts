import apiClient from "../../utils/apiClient"
import { GET_CUSTOMER_LIST } from "../urls/customerUrls"
import { CustomerType } from "../../type/salesType"

export const getCustomerList = async (): Promise<CustomerType[]> => {
  const response = await apiClient.get(GET_CUSTOMER_LIST)

  return response.data
}
