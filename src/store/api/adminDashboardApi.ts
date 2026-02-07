import { adminApi } from './adminApiBase'
import { coerceNumber } from './adminApiUtils'
import type { DashboardData, RecentRegistration, AppointmentStat } from '@/types/admin'

type RecentRegistrationApi = {
  date: string
  new_users?: string | number | null
  new_workers?: string | number | null
  new_workplaces?: string | number | null
}

type DashboardApi = {
  total_users?: string | number | null
  total_workers?: string | number | null
  total_workplaces?: string | number | null
  total_appointments?: string | number | null
  total_services?: string | number | null
  total_industries?: string | number | null
  recent_registrations?: RecentRegistrationApi[] | null
  appointment_stats?: AppointmentStat[] | null
}

const normalizeDashboard = (response: unknown): DashboardData => {
  if (!response || typeof response !== 'object') {
    return {
      total_users: 0,
      total_workers: 0,
      total_workplaces: 0,
      total_appointments: 0,
      total_services: 0,
      total_industries: 0,
      recent_registrations: [],
      appointment_stats: []
    }
  }

  const res = response as DashboardApi
  const recent = Array.isArray(res.recent_registrations)
    ? res.recent_registrations.map(
        (item): RecentRegistration => ({
          date: item.date,
          new_users: coerceNumber(item.new_users),
          new_workers: coerceNumber(item.new_workers),
          new_workplaces: coerceNumber(item.new_workplaces)
        })
      )
    : []

  return {
    total_users: coerceNumber(res.total_users),
    total_workers: coerceNumber(res.total_workers),
    total_workplaces: coerceNumber(res.total_workplaces),
    total_appointments: coerceNumber(res.total_appointments),
    total_services: coerceNumber(res.total_services),
    total_industries: coerceNumber(res.total_industries),
    recent_registrations: recent,
    appointment_stats: Array.isArray(res.appointment_stats) ? res.appointment_stats : []
  }
}

export const adminDashboardApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => '/api/admin/dashboard',
      transformResponse: (response: unknown) => normalizeDashboard(response),
      providesTags: [{ type: 'Dashboard', id: 'MAIN' }]
    })
  }),
  overrideExisting: false
})

export const { useGetDashboardQuery } = adminDashboardApi
