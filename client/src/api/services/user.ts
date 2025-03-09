import apiClient from "../../utils/apiClient"
import * as loginUrls from "../urls/loginUrls"
import { UserLogin } from "../../type/userType"
import { EmailJSPayload } from "../../type/emailJsPayload"

export const loginUser = async (credentials: UserLogin) => {
  const response = await apiClient.post(loginUrls.LOGIN_USER, credentials)

  return response.data
}

export const getUserDetails = async (usercode: string) => {
  const response = await apiClient.get(loginUrls.GET_USER_DETAILS(usercode))

  return response.data
}

export const forgotPassword = async (data: EmailJSPayload) => {
  const response = await apiClient.post(loginUrls.USER_FORGOT_PASSOWORD, data)

  return response.data
}