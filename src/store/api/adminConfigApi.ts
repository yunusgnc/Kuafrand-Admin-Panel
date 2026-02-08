import { adminApi } from './adminApiBase'
import type { ConfigItem, UpdateConfigRequest } from '@/types/admin'

const normalizeConfig = (response: unknown): ConfigItem[] => {
  if (Array.isArray(response)) return response as ConfigItem[]

  if (response && typeof response === 'object') {
    const record = response as Record<string, unknown>

    if (Array.isArray(record.config)) return record.config as ConfigItem[]
    if (Array.isArray(record.configs)) return record.configs as ConfigItem[]
    if (Array.isArray(record.data)) return record.data as ConfigItem[]
  }

  
return []
}

export const adminConfigApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getConfig: builder.query<ConfigItem[], void>({
      query: () => '/api/admin/config',
      transformResponse: (response: unknown) => normalizeConfig(response),
      providesTags: [{ type: 'Config', id: 'LIST' }]
    }),
    updateConfig: builder.mutation<ConfigItem[] | ConfigItem, UpdateConfigRequest>({
      query: body => ({
        url: '/api/admin/config',
        method: 'PATCH',
        body
      }),
      invalidatesTags: [{ type: 'Config', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const { useGetConfigQuery, useUpdateConfigMutation } = adminConfigApi
