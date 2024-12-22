// Define types for user data
export interface UserGroup {
  id: string
  code?: string
  isAdmin?: boolean
  isCreator?: boolean
  isEditor?: boolean
  status?: "active" | "inactive" | "pending" // String union for known statuses
}

export interface UserLogin {
  usercode: string
  password: string
}

export interface User {
  id: string
  loginCredentials: UserLogin
  firstname: string
  lastname: string
  email: string
  userGroup: UserGroup
  status: "active" | "inactive" | "pending" // String union for known statuses
}
