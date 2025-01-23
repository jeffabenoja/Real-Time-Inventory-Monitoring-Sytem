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
      const index = state.users.findIndex((user) => user.usercode === action.payload.usercode)
      if (index >= 0) {
        state.users[index] = action.payload
      }
    },
    replaceUserGroupList: (state, action) => {
      state.userGroup = action.payload
    },
    appendUserGroupList: (state, action) => {
      state.userGroup.push(action.payload)
    },
    updateUserGroup: (state, action) => {
      const index = state.userGroup.findIndex((user) => user.id === action.payload.id)
      if (index >= 0) {
        state.userGroup[index] = action.payload
      }
    }
  },
})

export const { replaceUserList, appendUserList, updateUser, replaceUserGroupList, appendUserGroupList, updateUserGroup } = adminSlice.actions
export default adminSlice.reducer
