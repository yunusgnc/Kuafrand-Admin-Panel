'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

import { getCookie, setCookie } from 'cookies-next'

import type { SupportedLocale } from '@/configs/i18n'
import { DEFAULT_LOCALE, getDirection, isValidLocale } from '@/configs/i18n'
import type { I18nContextValue, Dictionary } from '@/utils/i18n'
import { createTranslator, validateLocale } from '@/utils/i18n'
import { getDictionarySync } from '@/utils/getDictionary'

// Context
const I18nContext = createContext<I18nContextValue | null>(null)

// Hook
export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }

  return context
}

// Provider Props
interface I18nProviderProps {
  children: React.ReactNode
  initialLocale?: SupportedLocale
}

// Provider Component
export function I18nProvider({ children, initialLocale = DEFAULT_LOCALE }: I18nProviderProps) {
  // State
  const [locale, setLocale] = useState<SupportedLocale>(() => {
    // Server-side rendering için her zaman initial locale kullan
    if (typeof window === 'undefined') {
      return initialLocale
    }

    // Client-side'da cookie'den locale al
    const cookieLocale = getCookie('NEXT_LOCALE') as string

    if (cookieLocale && isValidLocale(cookieLocale)) {
      return cookieLocale
    }

    // Fallback to initial locale
    return validateLocale(initialLocale)
  })

  const [dictionary, setDictionary] = useState<Dictionary>(() => {
    return getDictionarySync(locale)
  })

  const [isHydrated, setIsHydrated] = useState(false)
  const [isServer, setIsServer] = useState(true)

  // Memoized values
  const direction = useMemo(() => getDirection(locale), [locale])

  const t = useMemo(() => createTranslator(dictionary), [dictionary])

  // Hydration effect
  useEffect(() => {
    setIsServer(false)
    setIsHydrated(true)
  }, [])

  // Change locale function
  const changeLocale = useCallback(
    async (newLocale: SupportedLocale) => {
      if (newLocale === locale || !isValidLocale(newLocale)) {
        return
      }

      try {
        // Update state
        setLocale(newLocale)

        // Update cookie
        setCookie('NEXT_LOCALE', newLocale, {
          path: '/',
          maxAge: 60 * 60 * 24 * 365, // 1 year
          sameSite: 'lax'
        })

        // Update dictionary
        const newDictionary = getDictionarySync(newLocale)

        setDictionary(newDictionary)

        // Don't update URL - just update the locale state
        // The URL should remain the same for the current page
      } catch (error) {
        console.error('Failed to change locale:', error)

        // Revert on error
        setLocale(locale)
      }
    },
    [locale]
  )

  // Effect to sync locale with cookie changes
  useEffect(() => {
    if (!isHydrated || isServer) return

    const handleStorageChange = () => {
      const cookieLocale = getCookie('NEXT_LOCALE') as string

      if (cookieLocale && isValidLocale(cookieLocale) && cookieLocale !== locale) {
        setLocale(cookieLocale)
        setDictionary(getDictionarySync(cookieLocale))
      }
    }

    // Listen for cookie changes
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [locale, isHydrated, isServer])

  // Effect to handle initial locale detection
  useEffect(() => {
    if (!isHydrated || isServer) return

    // If no locale in cookie, try to detect from browser
    if (!getCookie('NEXT_LOCALE')) {
      const browserLocale = navigator.language?.split('-')[0] as SupportedLocale

      if (isValidLocale(browserLocale) && browserLocale !== locale) {
        changeLocale(browserLocale)
      }
    }
  }, [isHydrated, isServer]) // eslint-disable-line react-hooks/exhaustive-deps

  // Context value
  const contextValue: I18nContextValue = useMemo(
    () => ({
      locale,
      dictionary,
      t,
      changeLocale,
      direction
    }),
    [locale, dictionary, t, changeLocale, direction]
  )

  // Server-side rendering sırasında hydration uyumsuzluğunu önle
  if (isServer || !isHydrated) {
    return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  }

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}

// Export the context for direct usage if needed
export { I18nContext }
