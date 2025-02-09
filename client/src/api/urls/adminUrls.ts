export const CREATE_USER = `/v1/user`
export const UPDATE_USER = (id:string) => `v1/user/${id}`
export const GET_USERS = `/v1/userList?status=ACTIVE`
export const GET_USER_GROUP_LIST = `v1/usergroupList?status=ACTIVE`
export const CREATE_USER_GROUP = `/v1/usergroup`
export const DELETE_USER_GROUP = (id: string) => `/v1/usergroup/${id}`
export const UPDATE_USER_GROUP = (id: string) => `/v1/usergroup/${id}`
