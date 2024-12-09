// Define types for user data
export interface userGroup {
  id: string
  code: string
  isAdmin: boolean
  isCreator: boolean
  isEditor: boolean
  status: "active" | "inactive" | "pending" // String union for known statuses
}

export interface User {
  id: string
  usercode: string
  firstname: string
  lastname: string
  userGroup: userGroup
  status: "active" | "inactive" | "pending" // String union for known statuses
}
