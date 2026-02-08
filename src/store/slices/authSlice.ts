import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { AdminUser } from '@/types/admin'
import { adminAuthApi } from '@/store/api/adminAuthApi'

interface AuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const getStoredUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('admin_user')

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

const initialState: AuthState = {
  user: getStoredUser(),
  token: storedToken,
  isAuthenticated: !!storedToken,
  isLoading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ admin: AdminUser; token: string }>) => {
      state.user = action.payload.admin
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null

      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', action.payload.token)
        localStorage.setItem('admin_user', JSON.stringify(action.payload.admin))
      }
    },
    logout: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(adminAuthApi.endpoints.adminLogin.matchPending, state => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(adminAuthApi.endpoints.adminLogin.matchFulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.admin
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null

        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', action.payload.token)
          localStorage.setItem('admin_user', JSON.stringify(action.payload.admin))
        }
      })
      .addMatcher(adminAuthApi.endpoints.adminLogin.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.error?.message || 'Login failed'
      })
  }
})

export const { setCredentials, logout, setLoading, setError, clearError } = authSlice.actions
export default authSlice.reducer
