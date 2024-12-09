const API = "/api"

// User API
export const USER_POST = `${API}/v1/user`
export const USER_LIST = `${API}/v1/userList`
export const USER_GROUP = `${API}/v1/usergroup`
export const USER_GROUP_LIST = (code: String) =>
  `${API}/v1/usergroup?code=${code}`
export const USER = (userCode: String) => `${API}/v1/user?usercode=${userCode}`
