import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'

import type { NotificationsType } from '@/components/layout/shared/NotificationsDropdown'

interface NotificationsState {
  notifications: NotificationsType[]
  unreadCount: number
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationsType[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter(notification => !notification.read).length
    },
    addNotification: (state, action: PayloadAction<NotificationsType>) => {
      state.notifications.unshift(action.payload)

      if (!action.payload.read) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const index = action.payload

      if (state.notifications[index] && !state.notifications[index].read) {
        state.notifications[index].read = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: state => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      const index = action.payload

      if (state.notifications[index] && !state.notifications[index].read) {
        state.unreadCount -= 1
      }

      state.notifications.splice(index, 1)
    },
    clearNotifications: state => {
      state.notifications = []
      state.unreadCount = 0
    }
  }
})

export const { setNotifications, addNotification, markAsRead, markAllAsRead, removeNotification, clearNotifications } =
  notificationsSlice.actions

export default notificationsSlice.reducer
