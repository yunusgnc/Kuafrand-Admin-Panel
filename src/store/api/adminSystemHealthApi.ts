import { adminApi } from './adminApiBase'
import type { SystemHealth } from '@/types/admin'

export const adminSystemHealthApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => '/api/admin/system-health',
      providesTags: [{ type: 'SystemHealth', id: 'MAIN' }]
    })
  }),
  overrideExisting: false
})

export const { useGetSystemHealthQuery } = adminSystemHealthApi
