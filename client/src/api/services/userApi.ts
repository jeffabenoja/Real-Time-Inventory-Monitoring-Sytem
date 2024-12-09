import { useQuery } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"
import * as userUrls from "../urls/userUrls"
import { User } from "../../type/userType"

// Axios instance
const apiClient = axios.create({
  baseURL: "/api",
})

// Fetch user list
export const useFetchUserList = () => {
  return useQuery<User[]>({
    queryKey: ["userList"],
    queryFn: async () => {
      const response: AxiosResponse<User[]> = await apiClient.get(
        userUrls.USER_LIST
      )
      if (!response.data) {
        throw new Error("Failed to fetch user list")
      }

      return response.data
    },
  })
}
