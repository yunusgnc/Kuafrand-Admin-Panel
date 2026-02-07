import type { SupportedLocale } from '@/configs/i18n'
import { DEFAULT_LOCALE, isValidLocale, SUPPORTED_LOCALES } from '@/configs/i18n'

export type Dictionary = Record<string, any>

export interface I18nContextValue {
  locale: SupportedLocale
  dictionary: Dictionary
  t: (key: string, params?: Record<string, string | number>) => string
  changeLocale: (locale: SupportedLocale) => void
  direction: 'ltr' | 'rtl'
}

export function interpolate(text: string, params: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match
  })
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

export function createTranslator(dictionary: Dictionary) {
  return (key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(dictionary, key)

    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`)

      return key
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`)

      return key
    }

    return params ? interpolate(value, params) : value
  }
}

export function validateLocale(locale: string): SupportedLocale {
  if (isValidLocale(locale)) {
    return locale
  }

  console.warn(`Invalid locale: ${locale}, falling back to: ${DEFAULT_LOCALE}`)

  return DEFAULT_LOCALE
}

export function getLocaleFromPathname(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (isValidLocale(firstSegment)) {
    return firstSegment
  }

  return null
}

export function addLocaleToPathname(pathname: string, locale: SupportedLocale): string {
  const segments = pathname.split('/').filter(Boolean)

  // If the first segment is already a locale, replace it
  if (isValidLocale(segments[0])) {
    segments[0] = locale
  } else {
    // Otherwise, add the locale at the beginning
    segments.unshift(locale)
  }

  return `/${segments.join('/')}`
}

export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)

  if (isValidLocale(segments[0])) {
    segments.shift()
  }

  return `/${segments.join('/')}`
}

export function getCanonicalPathname(pathname: string): string {
  return removeLocaleFromPathname(pathname)
}

export function createLocaleUrl(pathname: string, locale: SupportedLocale): string {
  return addLocaleToPathname(pathname, locale)
}

export function getAlternateLocales(currentLocale: SupportedLocale): SupportedLocale[] {
  return Object.keys(SUPPORTED_LOCALES)
    .filter(locale => locale !== currentLocale)
    .map(locale => locale as SupportedLocale)
}
