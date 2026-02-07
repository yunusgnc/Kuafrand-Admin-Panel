import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
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
} from '@/store/slices/settingsSlice'

export const useSettings = () => {
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()

  return {
    ...settings,
    setMode: (mode: string) => dispatch(setMode(mode as any)),
    setSkin: (skin: string) => dispatch(setSkin(skin as any)),
    setSemiDark: (semiDark: boolean) => dispatch(setSemiDark(semiDark)),
    setLayout: (layout: string) => dispatch(setLayout(layout as any)),
    setNavbarContentWidth: (width: string) => dispatch(setNavbarContentWidth(width as any)),
    setContentWidth: (width: string) => dispatch(setContentWidth(width as any)),
    setFooterContentWidth: (width: string) => dispatch(setFooterContentWidth(width as any)),
    setPrimaryColor: (color: string) => dispatch(setPrimaryColor(color)),
    updateSettings: (newSettings: Partial<typeof settings>) => dispatch(updateSettings(newSettings)),
    resetSettings: () => dispatch(resetSettings()),
    isSettingsChanged: false // Placeholder - implement if needed
  }
}
