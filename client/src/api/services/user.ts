import apiClient from "../../utils/apiClient"
import * as loginUrls from "../urls/loginUrls"
import { UserLogin } from "../../type/userType"

export const loginUser = async (logindata: UserLogin) => {
  const response = await apiClient.post(loginUrls.LOGIN_USER, logindata)

  return response.data
}
