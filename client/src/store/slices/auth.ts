import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../type/userType"

interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    },
    updateCurrentUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
        loggedInAt: state.user?.loggedInAt,
      };
    }
  },
})

export const { logout, login, updateCurrentUser } = authSlice.actions
export default authSlice.reducer
