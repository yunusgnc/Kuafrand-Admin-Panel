import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { Mode, Skin, Layout, LayoutComponentWidth } from '@core/types'

interface SettingsState {
  mode: Mode
  skin: Skin
  semiDark: boolean
  layout: Layout
  navbarContentWidth: LayoutComponentWidth
  contentWidth: LayoutComponentWidth
  footerContentWidth: LayoutComponentWidth
  primaryColor: string
}

const initialState: SettingsState = {
  mode: 'system',
  skin: 'default',
  semiDark: false,
  layout: 'vertical',
  navbarContentWidth: 'compact',
  contentWidth: 'compact',
  footerContentWidth: 'compact',
  primaryColor: '#9155FD'
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload
    },
    setSkin: (state, action: PayloadAction<Skin>) => {
      state.skin = action.payload
    },
    setSemiDark: (state, action: PayloadAction<boolean>) => {
      state.semiDark = action.payload
    },
    setLayout: (state, action: PayloadAction<Layout>) => {
      state.layout = action.payload
    },
    setNavbarContentWidth: (state, action: PayloadAction<LayoutComponentWidth>) => {
      state.navbarContentWidth = action.payload
    },
    setContentWidth: (state, action: PayloadAction<LayoutComponentWidth>) => {
      state.contentWidth = action.payload
    },
    setFooterContentWidth: (state, action: PayloadAction<LayoutComponentWidth>) => {
      state.footerContentWidth = action.payload
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload
    },
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload }
    },
    resetSettings: () => initialState
  }
})

export const {
  setMode,
  setSkin,
  setSemiDark,
  setLayout,
  setNavbarContentWidth,
  setContentWidth,
  setFooterContentWidth,
  setPrimaryColor,
  updateSettings,
  resetSettings
} = settingsSlice.actions

export default settingsSlice.reducer
