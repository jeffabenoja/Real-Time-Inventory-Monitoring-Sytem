import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Notification } from "../../type/notifications"

interface state {
  notifications: Notification[]
}

const initialState: state = {
  notifications: []
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    replaceNotifications(state, action: PayloadAction<Notification[]>) {
        state.notifications = action.payload
    },
    appendNotification(state, action: PayloadAction<Notification>){
        state.notifications.unshift(action.payload)
    },
    updateNotification(state, action: PayloadAction<Notification>){
        const index = state.notifications.findIndex((notification) => notification.id === action.payload.id)
        if(index >= 0){
            state.notifications[index] = action.payload
        }
    }
  },
})

export const { replaceNotifications, appendNotification, updateNotification} = notificationSlice.actions
export default notificationSlice.reducer
