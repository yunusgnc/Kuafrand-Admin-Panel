import { adminApi } from './adminApiBase'
import { coerceBoolean, normalizePaginated } from './adminApiUtils'
import type {
  Industry,
  IndustryListParams,
  PaginatedResponse,
  CreateIndustryRequest,
  UpdateIndustryRequest
} from '@/types/admin'

type IndustryApi = {
  id: string
  type?: string | null
  name?: string | null
  title?: string | null
  is_active?: boolean | string | number | null
  created_at?: string
  updated_at?: string
}

const toIndustry = (item: IndustryApi): Industry => {
  const isActive =
    item.is_active === undefined || item.is_active === null ? undefined : coerceBoolean(item.is_active)

  return {
    id: item.id,
    type: item.type ?? item.name ?? item.title ?? '',
    is_active: isActive,
    created_at: item.created_at ?? '',
    updated_at: item.updated_at ?? ''
  }
}

const normalizeIndustries = (response: unknown): PaginatedResponse<Industry> => {
  const normalized = normalizePaginated<IndustryApi>(response, ['industries', 'industry'])

  
return {
    data: normalized.data.map(toIndustry),
    total: normalized.total
  }
}

export const adminIndustriesApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getIndustries: builder.query<PaginatedResponse<Industry>, IndustryListParams>({
      query: params => ({
        url: '/api/admin/industries',
        params
      }),
      transformResponse: (response: unknown) => normalizeIndustries(response),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Industries' as const, id })), { type: 'Industries', id: 'LIST' }]
          : [{ type: 'Industries', id: 'LIST' }]
    }),
    createIndustry: builder.mutation<Industry, CreateIndustryRequest>({
      query: body => ({
        url: '/api/admin/industries',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Industries', id: 'LIST' }]
    }),
    updateIndustry: builder.mutation<Industry, UpdateIndustryRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/industry/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Industries', id },
        { type: 'Industries', id: 'LIST' }
      ]
    }),
    deleteIndustry: builder.mutation<void, string>({
      query: id => ({
        url: `/api/industry/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Industries', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetIndustriesQuery,
  useLazyGetIndustriesQuery,
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation
} = adminIndustriesApi
