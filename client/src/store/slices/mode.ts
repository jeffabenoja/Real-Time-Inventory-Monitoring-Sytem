import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Mode {
  mode: "light" | "dark"
}

const initialState: Mode = {
  mode: "light",
}

const authSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload
    },
  },
})

export const { toggle } = authSlice.actions
export default authSlice.reducer
