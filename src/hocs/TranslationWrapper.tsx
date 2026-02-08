'use client'

import type { ComponentType} from 'react';
import React, { forwardRef } from 'react'

import { useI18n } from '@/hooks/useI18n'
import type { I18nContextValue } from '@/utils/i18n'

// HOC Props interface
export interface WithTranslationProps {
  t: I18nContextValue['t']
  locale: I18nContextValue['locale']
  direction: I18nContextValue['direction']
  changeLocale: I18nContextValue['changeLocale']
}

// HOC function
export function withTranslation<P extends object>(Component: ComponentType<P & WithTranslationProps>) {
  return forwardRef<any, P>((props, ref) => {
    const { t, locale, direction, changeLocale } = useI18n()

    return (
      <Component
        {...(props as P)}
        ref={ref}
        t={t}
        locale={locale}
        direction={direction}
        changeLocale={changeLocale}
      />
    )
  })
}

// Hook-based HOC for functional components
export function useTranslation() {
  return useI18n()
}

// Higher-order component that provides translation context
export function TranslationWrapper<P extends object>(Component: ComponentType<P & WithTranslationProps>) {
  return withTranslation(Component)
}

// Utility HOC for components that only need the translation function
export function withT<P extends object>(Component: ComponentType<P & { t: I18nContextValue['t'] }>) {
  return forwardRef<any, P>((props, ref) => {
    const { t } = useI18n()

    return <Component {...(props as P)} ref={ref} t={t} />
  })
}

// Utility HOC for components that only need locale info
export function withLocale<P extends object>(Component: ComponentType<P & { locale: I18nContextValue['locale'] }>) {
  return forwardRef<any, P>((props, ref) => {
    const { locale } = useI18n()

    return <Component {...(props as P)} ref={ref} locale={locale} />
  })
}

// Utility HOC for components that only need direction
export function withDirection<P extends object>(
  Component: ComponentType<P & { direction: I18nContextValue['direction'] }>
) {
  return forwardRef<any, P>((props, ref) => {
    const { direction } = useI18n()

    return <Component {...(props as P)} ref={ref} direction={direction} />
  })
}
