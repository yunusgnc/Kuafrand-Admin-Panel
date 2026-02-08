import { useMemo } from 'react'

// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

// Hook Imports
import { useI18n } from '@/hooks/useI18n'

const useVerticalMenuData = (): VerticalMenuDataType[] => {
  const { t } = useI18n()

  return useMemo(
    () => [
      {
        label: t('menu.adminDashboard'),
        href: '/dashboard',
        icon: 'ri-dashboard-line'
      }
    ],
    [t]
  )
}

export default useVerticalMenuData
