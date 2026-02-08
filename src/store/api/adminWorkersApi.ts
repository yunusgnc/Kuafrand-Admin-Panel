import { adminApi } from './adminApiBase'
import { coerceBoolean, normalizePaginated } from './adminApiUtils'
import type {
  PaginatedResponse,
  Worker,
  WorkerListParams,
  UpdateWorkerRequest,
  CreateWorkerRequest,
  UpdateWorkerServiceRequest,
  RemoveWorkerServiceRequest
} from '@/types/admin'

type WorkerApi = {
  id: string
  first_name?: string | null
  last_name?: string | null
  full_name?: string | null
  user_name?: string | null
  email?: string | null
  phone_number?: string | null
  workplace_id?: string | null
  workplace_title?: string | null
  is_active?: boolean | string | number | null
  is_author?: boolean | string | number | null
  role?: string | null
  role_id?: number | null
  created_at?: string
  updated_at?: string
}

const toWorker = (item: WorkerApi): Worker => {
  const firstName = item.first_name ?? undefined
  const lastName = item.last_name ?? undefined
  const combinedName = [firstName, lastName].filter(value => value && value.trim().length > 0).join(' ')
  const fullName = item.full_name ?? (combinedName.length > 0 ? combinedName : undefined) ?? item.user_name ?? ''

  return {
    id: item.id,
    name: fullName,
    first_name: firstName,
    last_name: lastName,
    email: item.email ?? '',
    phone: item.phone_number ?? undefined,
    phone_number: item.phone_number ?? null,
    workplace_id: item.workplace_id ?? undefined,
    workplace_name: item.workplace_title ?? undefined,
    is_active: coerceBoolean(item.is_active),
    is_author: coerceBoolean(item.is_author),
    role: item.role ?? (item.role_id ? `Role ${item.role_id}` : undefined),
    role_id: item.role_id ?? undefined,
    created_at: item.created_at ?? '',
    updated_at: item.updated_at ?? ''
  }
}

const normalizeWorkers = (response: unknown): PaginatedResponse<Worker> => {
  const normalized = normalizePaginated<WorkerApi>(response, 'workers')

  
return {
    data: normalized.data.map(toWorker),
    total: normalized.total
  }
}

export const adminWorkersApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getWorkers: builder.query<PaginatedResponse<Worker>, WorkerListParams>({
      query: params => ({
        url: '/api/admin/workers',
        params
      }),
      transformResponse: (response: unknown) => normalizeWorkers(response),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Workers' as const, id })), { type: 'Workers', id: 'LIST' }]
          : [{ type: 'Workers', id: 'LIST' }]
    }),
    updateWorker: builder.mutation<Worker, UpdateWorkerRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/workers/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Workers', id },
        { type: 'Workers', id: 'LIST' }
      ]
    }),
    deleteWorker: builder.mutation<void, string>({
      query: id => ({
        url: `/api/workers/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Workers', id: 'LIST' }]
    }),
    createWorker: builder.mutation<Worker, CreateWorkerRequest>({
      query: body => ({
        url: '/api/workers',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Workers', id: 'LIST' }]
    }),
    updateWorkerAdmin: builder.mutation<Worker, UpdateWorkerRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/workers/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Workers', id },
        { type: 'Workers', id: 'LIST' }
      ]
    }),
    assignWorkerService: builder.mutation<void, UpdateWorkerServiceRequest>({
      query: ({ workerId, ...body }) => ({
        url: `/api/workers/${workerId}/services`,
        method: 'POST',
        body
      }),
      invalidatesTags: (_result, _error, { workerId }) => [{ type: 'Workers', id: workerId }]
    }),
    removeWorkerService: builder.mutation<void, RemoveWorkerServiceRequest>({
      query: ({ workerId, serviceId }) => ({
        url: `/api/workers/${workerId}/services/${serviceId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, { workerId }) => [{ type: 'Workers', id: workerId }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetWorkersQuery,
  useLazyGetWorkersQuery,
  useUpdateWorkerMutation,
  useDeleteWorkerMutation,
  useCreateWorkerMutation,
  useUpdateWorkerAdminMutation,
  useAssignWorkerServiceMutation,
  useRemoveWorkerServiceMutation
} = adminWorkersApi
