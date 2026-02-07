export type SupportedLocale = 'tr'

export interface LocaleConfig {
  code: SupportedLocale
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  flag: string
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: 'ltr',
    flag: '🇹🇷'
  }
}

export const DEFAULT_LOCALE: SupportedLocale = 'tr'

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

export const LOCALE_HEADER_NAME = 'Accept-Language'

export function isValidLocale(locale: string): locale is SupportedLocale {
  return Object.keys(SUPPORTED_LOCALES).includes(locale)
}

export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
  return SUPPORTED_LOCALES[locale]
}

export function getDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
  return SUPPORTED_LOCALES[locale].direction
}

export function getFallbackLocale(locale: SupportedLocale): SupportedLocale {
  // If the locale is not supported, fallback to default
  if (!isValidLocale(locale)) {
    return DEFAULT_LOCALE
  }

  return locale
}

export function parseAcceptLanguage(acceptLanguage: string): SupportedLocale[] {
  if (!acceptLanguage) return [DEFAULT_LOCALE]

  return acceptLanguage
    .split(',')
    .map(lang => {
      const [code] = lang.trim().split(';')
      const locale = code.split('-')[0] as SupportedLocale

      return locale
    })
    .filter(isValidLocale)
    .filter((locale, index, array) => array.indexOf(locale) === index) // Remove duplicates
}

export function getBestLocale(acceptLanguage: string): SupportedLocale {
  const preferredLocales = parseAcceptLanguage(acceptLanguage)

  return preferredLocales[0] || DEFAULT_LOCALE
}
