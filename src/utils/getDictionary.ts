import type { SupportedLocale } from '@/configs/i18n'
import { DEFAULT_LOCALE, isValidLocale } from '@/configs/i18n'
import type { Dictionary } from './i18n'

// Import all dictionaries
import trDictionary from '@/data/dictionaries/tr.json'

const dictionaries: Record<SupportedLocale, Dictionary> = {
  tr: trDictionary
}

export async function getDictionary(locale: SupportedLocale): Promise<Dictionary> {
  // Validate the locale
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE

  try {
    // Return the dictionary for the valid locale
    return dictionaries[validLocale]
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${validLocale}`, error)

    // Fallback to default locale
    return dictionaries[DEFAULT_LOCALE]
  }
}

export function getDictionarySync(locale: SupportedLocale): Dictionary {
  // Validate the locale
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE

  try {
    // Return the dictionary for the valid locale
    return dictionaries[validLocale]
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${validLocale}`, error)

    // Fallback to default locale
    return dictionaries[DEFAULT_LOCALE]
  }
}

export function getAvailableLocales(): SupportedLocale[] {
  return Object.keys(dictionaries) as SupportedLocale[]
}

export function hasDictionary(locale: SupportedLocale): boolean {
  return locale in dictionaries
}

// Preload all dictionaries to avoid loading delays
export function preloadDictionaries(): void {
  // This function can be called during app initialization
  // to ensure all dictionaries are loaded and cached
  Object.keys(dictionaries).forEach(locale => {
    if (hasDictionary(locale as SupportedLocale)) {
      // Dictionary is already loaded
    }
  })
}
