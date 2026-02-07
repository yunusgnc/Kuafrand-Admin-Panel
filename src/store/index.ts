import { configureStore } from '@reduxjs/toolkit'

import { adminApi } from '@/store/api/adminApi'
import authSlice from '@/store/slices/authSlice'
import i18nSlice from '@/store/slices/i18nSlice'
import notificationsSlice from '@/store/slices/notificationsSlice'
import settingsSlice from '@/store/slices/settingsSlice'

export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    i18n: i18nSlice,
    auth: authSlice,
    notifications: notificationsSlice,
    [adminApi.reducerPath]: adminApi.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }).concat(adminApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
