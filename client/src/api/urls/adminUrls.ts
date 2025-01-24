export const CREATE_USER = `/v1/user`
export const GET_USERS = `/v1/userList`
export const GET_USER_GROUP_LIST = `v1/usergroupList`
export const CREATE_USER_GROUP = `/v1/usergroup`
export const DELETE_USER_GROUP = (id: string) => `/v1/usergroup/${id}`
export const UPDATE_USER_GROUP = (id: string) => `/v1/usergroup/${id}`
