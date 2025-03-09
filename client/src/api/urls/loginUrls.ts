// const API = "/api"

export const LOGIN_USER = `/v1/login`
export const USER_FORGOT_PASSOWORD = `https://api.emailjs.com/api/v1.0/email/send`
export const GET_USER_DETAILS = (usercode: string) => `/v1/user?usercode=${usercode}`