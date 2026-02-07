'use client'

// React Imports
import type { ReactNode } from 'react'

// Redux Imports
import { Provider } from 'react-redux'

import { store } from '@/store'

// React Query Imports
import { ReactQueryProvider } from '@/lib/react-query'

// Context Imports (keeping some for compatibility)
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import type { Settings } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// I18n Imports
import { I18nProvider } from '@/contexts/i18nContext'

// Type Imports
import type { Mode } from '@core/types'

type Props = {
  children: ReactNode
  direction: 'ltr' | 'rtl'
  systemMode?: 'light' | 'dark'
  settingsCookie?: Settings | null
  mode?: Mode
}

const Providers = (props: Props) => {
  // Props
  const { children, direction, systemMode = 'light', settingsCookie = null, mode } = props

  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <I18nProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
            <VerticalNavProvider>
              <ThemeProvider direction={direction} systemMode={systemMode}>
                {children}
              </ThemeProvider>
            </VerticalNavProvider>
          </SettingsProvider>
        </I18nProvider>
      </ReactQueryProvider>
    </Provider>
  )
}

export default Providers
