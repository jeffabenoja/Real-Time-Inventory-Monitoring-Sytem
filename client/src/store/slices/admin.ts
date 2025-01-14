import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../type/userType'

interface state {
  users: User[]
}

const initialState : state = {
  users: []
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    replaceUserList: (state, action) => {
      state.users = action.payload
    },
    appendUserList: (state, action) => {
      state.users.push(action.payload)
    }
  }
})

export const { replaceUserList, appendUserList } = adminSlice.actions
export default adminSlice.reducer