import { useMemo } from 'react'

// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

// Hook Imports
import { useI18n } from '@/hooks/useI18n'

const useHorizontalMenuData = (): HorizontalMenuDataType[] => {
  const { t } = useI18n()

  return useMemo(
    () => [
      {
        label: t('menu.home'),
        href: '/home',
        icon: 'ri-home-smile-line'
      },
      {
        label: t('menu.about'),
        href: '/about',
        icon: 'ri-information-line'
      }
    ],
    [t]
  )
}

export default useHorizontalMenuData
