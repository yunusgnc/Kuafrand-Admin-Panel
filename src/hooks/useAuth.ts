import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout as logoutAction, clearError } from '@/store/slices/authSlice'
import { useAdminLoginMutation } from '@/store/api/adminApi'
import type { AdminLoginRequest } from '@/types/admin'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth)
  const [loginMutation, { isLoading: isLoginLoading }] = useAdminLoginMutation()

  const login = useCallback(
    async (credentials: AdminLoginRequest) => {
      try {
        await loginMutation(credentials).unwrap()
        router.push('/home')
      } catch {
        // error handled by authSlice extraReducers
      }
    },
    [loginMutation, router]
  )

  const logout = useCallback(() => {
    dispatch(logoutAction())
    router.push('/login')
  }, [dispatch, router])

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading,
    error,
    login,
    logout,
    resetError
  }
}
