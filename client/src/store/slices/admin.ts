import { createSlice } from "@reduxjs/toolkit"
import { User, UserGroup } from "../../type/userType"

interface state {
  users: User[]
  userGroup: UserGroup[]
}

const initialState: state = {
  users: [],
  userGroup: []
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    replaceUserList: (state, action) => {
      state.users = action.payload
    },
    appendUserList: (state, action) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id)
      if (index >= 0) {
        state.users[index] = action.payload
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id)
    },
    replaceUserGroupList: (state, action) => {
      state.userGroup = action.payload
    },
    appendUserGroupList: (state, action) => {
      state.userGroup.push(action.payload)
    },
    updateUserGroup: (state, action) => {
      const index = state.userGroup.findIndex((group) => group.id === action.payload.id)
      if (index >= 0) {
        state.userGroup[index] = action.payload
      }
    },
    deleteUserGroup: (state, action) => {
      state.userGroup = state.userGroup.filter((group) => group.id !== action.payload.id)
    },
  },
})

export const { replaceUserList, appendUserList, updateUser, deleteUser, replaceUserGroupList, appendUserGroupList, updateUserGroup, deleteUserGroup } = adminSlice.actions
export default adminSlice.reducer
