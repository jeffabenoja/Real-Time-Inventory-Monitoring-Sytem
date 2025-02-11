// src/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authReducer, {logout} from "./slices/auth"
import adminReducer from "./slices/admin"
import modeReducer from "./slices/mode"
import notificationReducer from "./slices/notifications"

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import sessionStorage from "redux-persist/lib/storage/session"

const appReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  mode: modeReducer,
  notifcation: notificationReducer,
})

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};




// Configuration object for redux-persist
const persistConfig = {
  key: "root",
  storage: sessionStorage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure the Redux store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
