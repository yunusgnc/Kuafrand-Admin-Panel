import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { SupportedLocale } from '@/configs/i18n'
import { DEFAULT_LOCALE, getDirection } from '@/configs/i18n'
import type { Dictionary } from '@/utils/i18n'
import trDictionary from '@/data/dictionaries/tr.json'

interface I18nState {
  locale: SupportedLocale
  dictionary: Dictionary
  direction: 'ltr' | 'rtl'
}

const initialState: I18nState = {
  locale: DEFAULT_LOCALE,
  dictionary: trDictionary as unknown as Dictionary,
  direction: getDirection(DEFAULT_LOCALE)
}

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<SupportedLocale>) => {
      state.locale = action.payload
    },
    setDictionary: (state, action: PayloadAction<Dictionary>) => {
      state.dictionary = action.payload
    },
    setDirection: (state, action: PayloadAction<'ltr' | 'rtl'>) => {
      state.direction = action.payload
    },
    updateI18n: (state, action: PayloadAction<Partial<I18nState>>) => {
      return { ...state, ...action.payload }
    }
  }
})

export const { setLocale, setDictionary, setDirection, updateI18n } = i18nSlice.actions

export default i18nSlice.reducer
