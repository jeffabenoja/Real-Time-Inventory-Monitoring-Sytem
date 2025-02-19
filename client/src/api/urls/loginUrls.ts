// const API = "/api"

export const LOGIN_USER = `/v1/login`
export const USER_RESET_PASSWORD = `/v1/resetPassword`
export const USER_FORGOT_PASSOWRD = (email: string) =>
  `/v1/forgotPassword?email=${email}`
export const GET_USER_DETAILS = (usercode: string) => `/v1/user?usercode=${usercode}`