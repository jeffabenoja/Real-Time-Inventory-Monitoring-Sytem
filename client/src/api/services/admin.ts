import apiClient from "../../utils/apiClient"
import {
  CREATE_USER,
  GET_USER_GROUP_LIST,
  GET_USERS,
  CREATE_USER_GROUP,
  DELETE_USER_GROUP,
  UPDATE_USER_GROUP,
  UPDATE_USER,
} from "../urls/adminUrls"
import { User, UserGroup } from "../../type/userType"

export const createUser = async (user: User) => {
  const response = await apiClient.post(CREATE_USER, user)

  return response.data
}

export const getUserList = async () => {
  const response = await apiClient.get(GET_USERS)

  return response.data
}

export const updateUser = async ({id, user} : {id: string, user:User}) => {
  const response = await apiClient.put(UPDATE_USER(id), user)

  return response.data
}

export const deleteUser = async (user: User) => {
  let data = { ...user, status: "INACTIVE" }
  const response = await apiClient.put(UPDATE_USER(data.id!), data)

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
  if (!userGroup.id) {
    throw new Error("User group ID is required")
  }
  const response = await apiClient.put(
    UPDATE_USER_GROUP(userGroup.id),
    userGroup
  )
  return response.data
}

export const deleteUserGroup = async (userGroup: UserGroup) => {
  if (!userGroup.id) {
    throw new Error("User group ID is required")
  }
  let data = { ...userGroup, status: "INACTIVE" }
  const response = await apiClient.put(DELETE_USER_GROUP(userGroup.id), data)
  return response.data
}
