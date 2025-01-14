import apiClient from "../../utils/apiClient"
import { CREATE_USER, GET_ITEMS, GET_USERS } from "../urls/adminUrls"
import { UserSignUp } from "../../type/userType"

export const createUser = async (signUpData: UserSignUp) => {
    const response = await apiClient.post(CREATE_USER, signUpData)
  
    return response.data
}

export const getUserList = async () => {
    const response = await apiClient.get(GET_USERS)
  
    return response.data
}

export const getItemList = async () => {
    const response = await apiClient.get(GET_ITEMS)

    return response.data
}