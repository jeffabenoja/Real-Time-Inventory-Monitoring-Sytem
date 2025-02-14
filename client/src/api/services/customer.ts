import apiClient from "../../utils/apiClient"
import { GET_CUSTOMER_LIST, CREATE_CUSTOMER } from "../urls/customerUrls"
import { CustomerType, NewCustomerType } from "../../type/salesType"

export const getCustomerList = async (): Promise<CustomerType[]> => {
  const response = await apiClient.get(GET_CUSTOMER_LIST)

  return response.data
}

export const createNewCustomer = async (customer: NewCustomerType) => {
  const response = await apiClient.post(CREATE_CUSTOMER, customer)

  return response.data
}
