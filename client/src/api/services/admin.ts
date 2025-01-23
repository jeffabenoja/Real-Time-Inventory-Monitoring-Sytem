import apiClient from "../../utils/apiClient"
import { CREATE_USER, GET_USER_GROUP_LIST, GET_USERS, CREATE_USER_GROUP } from "../urls/adminUrls"
import { User, UserGroup } from "../../type/userType"


export const createUser = async (user: User) => {
  const response = await apiClient.post(CREATE_USER, user)

  return response.data
}

export const getUserList = async () => {
  const response = await apiClient.get(GET_USERS)

  return response.data
}

export const updateUser = async (user: User) => {
  const response = await apiClient.put(CREATE_USER, user)

  return response.data
}

export const deleteUser = async (user: User) => {
  let data = {...user, status: "INACTIVE"}
  const response = await apiClient.put(CREATE_USER, data)

  return response.data
}


export const getUserGroupList = async () => {
  const response = await apiClient.get(GET_USER_GROUP_LIST)

  return response.data
}

export const createUserGroup = async (userGroup: UserGroup) => {
  const response = await apiClient.post(CREATE_USER_GROUP, userGroup)

  return response.data
}

export const updateUserGroup = async (userGroup: UserGroup) => {
  const response = await apiClient.put(CREATE_USER_GROUP, userGroup)

  return response.data
}

export const deleteUserGroup = async (userGroup: UserGroup) => {
  let data = {...userGroup, status: "INACTIVE"}
  const response = await apiClient.put(CREATE_USER_GROUP, data)

  console.log(response.data)
  return response.data
}


