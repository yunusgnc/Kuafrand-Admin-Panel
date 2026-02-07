// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import { getCookie } from 'cookies-next'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode, getSettingsFromCookie, getMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Provider Imports
import Providers from '@/components/Providers'

// I18n Imports
import { DEFAULT_LOCALE, getDirection, isValidLocale } from '@/configs/i18n'

export const metadata = {
  title: 'Materialize - Material Next.js Admin Template',
  description: 'Materialize - Material Next.js Admin Template'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Vars
  const systemMode = await getSystemMode()
  const settingsCookie = await getSettingsFromCookie()
  const mode = await getMode()

  // Get locale from cookie or use default
  const cookieLocale = getCookie('NEXT_LOCALE') as string
  const locale = cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE
  const direction = getDirection(locale)

  return (
    <html id='__next' lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`flex is-full min-bs-full flex-auto flex-col ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        <Providers direction={direction} systemMode={systemMode} settingsCookie={settingsCookie} mode={mode}>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
