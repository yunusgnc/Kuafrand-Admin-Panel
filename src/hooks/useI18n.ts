import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLocale, setDictionary, setDirection } from '@/store/slices/i18nSlice'
import { createTranslator, interpolate, getNestedValue } from '@/utils/i18n'
import { getDictionarySync } from '@/utils/getDictionary'
import { getDirection } from '@/configs/i18n'
import { useMemo } from 'react'
import type { SupportedLocale } from '@/configs/i18n'

export const useI18n = () => {
  const { locale, dictionary, direction } = useAppSelector(state => state.i18n)
  const dispatch = useAppDispatch()

  const t = useMemo(() => createTranslator(dictionary), [dictionary])

  const changeLocale = (newLocale: SupportedLocale) => {
    dispatch(setLocale(newLocale))
    dispatch(setDirection(getDirection(newLocale)))

    // Load dictionary for new locale
    const newDictionary = getDictionarySync(newLocale)
    dispatch(setDictionary(newDictionary))
  }

  return {
    locale,
    dictionary,
    direction,
    t,
    changeLocale
  }
}
