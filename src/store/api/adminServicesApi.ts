import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type { Service, ServiceListParams, PaginatedResponse, CreateServiceRequest, UpdateServiceRequest } from '@/types/admin'

type ServiceApi = {
  id: string
  name?: string | null
  title?: string | null
  description?: string | null
  created_at?: string
  updated_at?: string
}

const toService = (item: ServiceApi): Service => ({
  id: item.id,
  name: item.name ?? item.title ?? '',
  description: item.description ?? undefined,
  created_at: item.created_at ?? '',
  updated_at: item.updated_at ?? ''
})

const normalizeServices = (response: unknown): PaginatedResponse<Service> => {
  const normalized = normalizePaginated<ServiceApi>(response, 'services')
  return {
    data: normalized.data.map(toService),
    total: normalized.total
  }
}

export const adminServicesApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getServices: builder.query<PaginatedResponse<Service>, ServiceListParams>({
      query: params => ({
        url: '/api/admin/services',
        params
      }),
      transformResponse: (response: unknown) => normalizeServices(response),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Services' as const, id })), { type: 'Services', id: 'LIST' }]
          : [{ type: 'Services', id: 'LIST' }]
    }),
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: body => ({
        url: '/api/admin/services',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Services', id: 'LIST' }]
    }),
    updateService: builder.mutation<Service, UpdateServiceRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/services/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Services', id },
        { type: 'Services', id: 'LIST' }
      ]
    }),
    deleteService: builder.mutation<void, string>({
      query: id => ({
        url: `/api/services/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Services', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetServicesQuery,
  useLazyGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation
} = adminServicesApi
