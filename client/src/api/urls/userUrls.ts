// const API = "/api"

// User API
export const USER_POST = `/v1/user`
export const USER_LIST = `/v1/userList`
export const USER_GROUP = `/v1/usergroup`
export const USER_GROUP_LIST = (code: String) => `/v1/usergroup?code=${code}`
export const USER = (userCode: String) => `}/v1/user?usercode=${userCode}`
