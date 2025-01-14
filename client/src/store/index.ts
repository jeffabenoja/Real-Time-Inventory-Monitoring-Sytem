// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import adminReducer from './slices/admin'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch