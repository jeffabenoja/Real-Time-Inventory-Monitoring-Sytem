const API = "/api"

export const LOGIN_USER = `${API}/v1/login`
export const USER_RESET_PASSWORD = `${API}/v1/resetPassword`
export const USER_FORGOT_PASSOWRD = (email: String) =>
  `${API}/v1/forgotPassword?email=${email}`
