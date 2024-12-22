import axios from "axios"
import * as loginUrls from "../urls/loginUrls"
import { UserLogin } from "../../type/userType"

const apiClient = axios.create({
  baseURL: "/api",
})

// Login user API call
export const loginUser = async (logindata: UserLogin) => {
  try {
    const response = await apiClient.post(loginUrls.LOGIN_USER, logindata)

    // Check if the response contains data
    if (!response || !response.data) {
      throw new Error("No data received from server")
    }

    return response.data
  } catch (error: any) {
    // If it's an axios error (like network failure or non-2xx status)
    if (error.response) {
      // Handle HTTP errors, can be expanded based on specific status codes
      throw new Error(
        `Login Status: ${
          error.response.data?.message || error.response.statusText
        }`
      )
    } else if (error.request) {
      // If no response was received
      throw new Error("Network error, please try again later.")
    } else {
      // If some other error occurred
      throw new Error(error.message || "An unknown error occurred.")
    }
  }
}
