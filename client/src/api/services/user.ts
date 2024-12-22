import axios from "axios"
import * as loginUrls from "../urls/loginUrls"
import { UserLogin } from "../../type/userType"

// Axios instance
const apiClient = axios.create({
  baseURL: "/api",
})

// Login user API call
export const loginUser = async (logindata: UserLogin) => {
  const response = await apiClient.post(loginUrls.LOGIN_USER, logindata)

  if (!response.data) {
    throw new Error("Failed to login")
  }
  return response.data
}
