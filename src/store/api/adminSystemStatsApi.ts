import { adminApi } from './adminApiBase'
import { coerceNumber } from './adminApiUtils'
import type { SystemStats } from '@/types/admin'

type MonthlyGrowthApi = {
  month: string
  new_users?: string | number | null
  new_workers?: string | number | null
  new_workplaces?: string | number | null
}

type PopularServiceApi = {
  name: string
  worker_count?: string | number | null
  appointment_count?: string | number | null
}

type IndustryDistributionApi = {
  type: string
  workplace_count?: string | number | null
  worker_count?: string | number | null
}

type SystemStatsApi = {
  monthly_growth?: MonthlyGrowthApi[] | null
  popular_services?: PopularServiceApi[] | null
  industry_distribution?: IndustryDistributionApi[] | null
}

const normalizeSystemStats = (response: unknown): SystemStats => {
  if (!response || typeof response !== 'object') {
    return {
      monthly_growth: [],
      popular_services: [],
      industry_distribution: []
    }
  }

  const res = response as SystemStatsApi

  const monthly = Array.isArray(res.monthly_growth)
    ? res.monthly_growth.map(item => ({
        month: item.month,
        new_users: coerceNumber(item.new_users),
        new_workers: coerceNumber(item.new_workers),
        new_workplaces: coerceNumber(item.new_workplaces)
      }))
    : []

  const services = Array.isArray(res.popular_services)
    ? res.popular_services.map(item => ({
        name: item.name,
        worker_count: coerceNumber(item.worker_count),
        appointment_count: coerceNumber(item.appointment_count)
      }))
    : []

  const industry = Array.isArray(res.industry_distribution)
    ? res.industry_distribution.map(item => ({
        type: item.type,
        workplace_count: coerceNumber(item.workplace_count),
        worker_count: coerceNumber(item.worker_count)
      }))
    : []

  return {
    monthly_growth: monthly,
    popular_services: services,
    industry_distribution: industry
  }
}

export const adminSystemStatsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getSystemStats: builder.query<SystemStats, void>({
      query: () => '/api/admin/system-stats',
      transformResponse: (response: unknown) => normalizeSystemStats(response),
      providesTags: [{ type: 'SystemStats', id: 'MAIN' }]
    })
  }),
  overrideExisting: false
})

export const { useGetSystemStatsQuery } = adminSystemStatsApi
