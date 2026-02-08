'use client'

import { useEffect, type ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/store/hooks'

type AuthGuardProps = {
  children: ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter()
  const { token, isAuthenticated } = useAppSelector(state => state.auth)

  useEffect(() => {
    const isLoggedIn = !!(token ?? isAuthenticated)

    if (!isLoggedIn) {
      router.replace('/login')
    }
  }, [token, isAuthenticated, router])

  return <>{children}</>
}

export default AuthGuard
