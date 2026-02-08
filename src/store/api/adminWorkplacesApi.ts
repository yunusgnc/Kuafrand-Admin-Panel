import { adminApi } from './adminApiBase'
import { coerceBoolean, normalizePaginated } from './adminApiUtils'
import type { PaginatedResponse, Workplace, WorkplaceListParams, UpdateWorkplaceRequest, CreateWorkplaceRequest } from '@/types/admin'

type WorkplaceApi = {
  id: string
  title?: string | null
  name?: string | null
  industry_type_id?: number | null
  address?: string | null
  phone?: string | null
  is_active?: boolean | string | null
  created_at?: string
  updated_at?: string
}

const toWorkplace = (item: WorkplaceApi): Workplace => ({
  id: item.id,
  name: item.title ?? item.name ?? '',
  industry_type_id: item.industry_type_id ?? undefined,
  address: item.address ?? undefined,
  phone: item.phone ?? undefined,
  is_active: coerceBoolean(item.is_active),
  created_at: item.created_at ?? '',
  updated_at: item.updated_at ?? ''
})

const normalizeWorkplaces = (response: unknown): PaginatedResponse<Workplace> => {
  const normalized = normalizePaginated<WorkplaceApi>(response, 'workplaces')

  
return {
    data: normalized.data.map(toWorkplace),
    total: normalized.total
  }
}

export const adminWorkplacesApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getWorkplaces: builder.query<PaginatedResponse<Workplace>, WorkplaceListParams>({
      query: params => ({
        url: '/api/admin/workplaces',
        params
      }),
      transformResponse: (response: unknown) => normalizeWorkplaces(response),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Workplaces' as const, id })),
              { type: 'Workplaces', id: 'LIST' }
            ]
          : [{ type: 'Workplaces', id: 'LIST' }]
    }),
    updateWorkplace: builder.mutation<Workplace, UpdateWorkplaceRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/workplaces/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Workplaces', id },
        { type: 'Workplaces', id: 'LIST' }
      ]
    }),
    deleteWorkplace: builder.mutation<void, string>({
      query: id => ({
        url: `/api/admin/workplaces/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Workplaces', id: 'LIST' }]
    }),
    createWorkplace: builder.mutation<Workplace, CreateWorkplaceRequest>({
      query: body => ({
        url: '/api/workplaces',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Workplaces', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetWorkplacesQuery,
  useLazyGetWorkplacesQuery,
  useUpdateWorkplaceMutation,
  useDeleteWorkplaceMutation,
  useCreateWorkplaceMutation
} = adminWorkplacesApi
