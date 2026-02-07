import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type {
  IndustryService,
  IndustryServiceListParams,
  PaginatedResponse,
  CreateIndustryServiceRequest
} from '@/types/admin'

type IndustryServiceApi = {
  id: string
  industry_id?: number | string | null
  service_id?: number | string | null
  industry_name?: string | null
  industry_type?: string | null
  industry?: {
    type?: string | null
    name?: string | null
  } | null
  name?: string | null
  title?: string | null
  service_name?: string | null
  description?: string | null
  service?: {
    name?: string | null
    title?: string | null
    description?: string | null
  } | null
  created_at?: string
}

const toIndustryService = (item: IndustryServiceApi, industryId?: number | string): IndustryService => {
  const serviceId = item.service_id ?? item.id

  return {
    id: item.id ?? String(serviceId ?? ''),
    industry_id: item.industry_id ?? industryId,
    service_id: serviceId,
    industry_name:
      item.industry_name ?? item.industry?.type ?? item.industry?.name ?? item.industry_type ?? undefined,
    service_name:
      item.service_name ?? item.service?.name ?? item.service?.title ?? item.name ?? item.title ?? undefined,
    description: item.description ?? item.service?.description ?? undefined,
    created_at: item.created_at
  }
}

const normalizeIndustryServices = (
  response: unknown,
  industryId?: number | string
): PaginatedResponse<IndustryService> => {
  const normalized = normalizePaginated<IndustryServiceApi>(response, [
    'industry_services',
    'industryServices',
    'services',
    'data'
  ])

  return {
    data: normalized.data.map(item => toIndustryService(item, industryId)),
    total: normalized.total
  }
}

export const adminIndustryServicesApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getIndustryServices: builder.query<PaginatedResponse<IndustryService>, IndustryServiceListParams>({
      query: params => ({
        url: '/api/admin/industry-services',
        params
      }),
      transformResponse: (response: unknown, _meta, arg) => normalizeIndustryServices(response, arg.industry_id),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'IndustryServices' as const, id })),
              { type: 'IndustryServices', id: 'LIST' }
            ]
          : [{ type: 'IndustryServices', id: 'LIST' }]
    }),
    createIndustryService: builder.mutation<IndustryService, CreateIndustryServiceRequest>({
      query: ({ industry_id, service_id }) => ({
        url: '/api/admin/industry-services',
        method: 'POST',
        body: { industry_id, service_id }
      }),
      invalidatesTags: [{ type: 'IndustryServices', id: 'LIST' }]
    }),
    deleteIndustryService: builder.mutation<void, CreateIndustryServiceRequest>({
      query: ({ industry_id, service_id }) => ({
        url: `/api/industry/${industry_id}/services/${service_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'IndustryServices', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetIndustryServicesQuery,
  useLazyGetIndustryServicesQuery,
  useCreateIndustryServiceMutation,
  useDeleteIndustryServiceMutation
} = adminIndustryServicesApi
