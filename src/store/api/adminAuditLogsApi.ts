import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type { AuditLog, AuditLogListParams, PaginatedResponse } from '@/types/admin'

const normalizeAuditLogs = (response: unknown): PaginatedResponse<AuditLog> => {
  return normalizePaginated<AuditLog>(response, ['audit_logs', 'auditLogs', 'data'])
}

export const adminAuditLogsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getAuditLogs: builder.query<PaginatedResponse<AuditLog>, AuditLogListParams>({
      query: params => ({
        url: '/api/admin/audit-logs',
        params
      }),
      transformResponse: (response: unknown) => normalizeAuditLogs(response),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'AuditLogs' as const, id })), { type: 'AuditLogs', id: 'LIST' }]
          : [{ type: 'AuditLogs', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const { useGetAuditLogsQuery, useLazyGetAuditLogsQuery } = adminAuditLogsApi
