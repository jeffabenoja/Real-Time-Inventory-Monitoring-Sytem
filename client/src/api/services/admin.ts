import apiClient from "../../utils/apiClient"
import { CREATE_USER, GET_USERS } from "../urls/adminUrls"
import { User } from "../../type/userType"


export const createUser = async (signUpData: User) => {
  const response = await apiClient.post(CREATE_USER, signUpData)

  return response.data
}

export const getUserList = async () => {
  const response = await apiClient.get(GET_USERS)

  return response.data
}
