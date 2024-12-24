import axios from "axios"

const apiClient = axios.create({
  baseURL: "/api",
})

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(
        new Error(
          `${error.response.data?.message || error.response.statusText}`
        )
      )
    } else if (error.request) {
      return Promise.reject(new Error("Network error, please try again later."))
    } else {
      return Promise.reject(
        new Error(error.message || "An unknown error occurred.")
      )
    }
  }
)

export default apiClient
