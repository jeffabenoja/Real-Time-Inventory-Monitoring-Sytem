import apiClient from "../../utils/apiClient"
import * as loginUrls from "../urls/loginUrls"
import { UserLogin } from "../../type/userType"

export const loginUser = async (credentials: UserLogin) => {
  const response = await apiClient.post(loginUrls.LOGIN_USER, credentials)

  return response.data
}
