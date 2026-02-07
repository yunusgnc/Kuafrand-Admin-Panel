import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications
} from '@/store/slices/notificationsSlice'
import type { NotificationsType } from '@/components/layout/shared/NotificationsDropdown'

export const useNotifications = () => {
  const { notifications, unreadCount } = useAppSelector(state => state.notifications)
  const dispatch = useAppDispatch()

  return {
    notifications,
    unreadCount,
    setNotifications: (notifications: NotificationsType[]) => dispatch(setNotifications(notifications)),
    addNotification: (notification: NotificationsType) => dispatch(addNotification(notification)),
    markAsRead: (index: number) => dispatch(markAsRead(index)),
    markAllAsRead: () => dispatch(markAllAsRead()),
    removeNotification: (index: number) => dispatch(removeNotification(index)),
    clearNotifications: () => dispatch(clearNotifications())
  }
}
