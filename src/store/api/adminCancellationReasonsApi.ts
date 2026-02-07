import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type {
  PaginatedResponse,
  CancellationReason,
  CancellationReasonListParams,
  CreateCancellationReasonRequest,
  UpdateCancellationReasonRequest
} from '@/types/admin'

const normalizeCancellationReasons = (response: unknown): PaginatedResponse<CancellationReason> => {
  return normalizePaginated<CancellationReason>(response, ['cancellation_reasons', 'cancellationReasons', 'data'])
}

export const adminCancellationReasonsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getCancellationReasons: builder.query<PaginatedResponse<CancellationReason>, CancellationReasonListParams>({
      query: params => ({
        url: '/api/cancellation-reasons',
        params
      }),
      transformResponse: (response: unknown) => normalizeCancellationReasons(response),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'CancellationReasons' as const, id })),
              { type: 'CancellationReasons', id: 'LIST' }
            ]
          : [{ type: 'CancellationReasons', id: 'LIST' }]
    }),
    createCancellationReason: builder.mutation<CancellationReason, CreateCancellationReasonRequest>({
      query: body => ({
        url: '/api/cancellation-reasons',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'CancellationReasons', id: 'LIST' }]
    }),
    updateCancellationReason: builder.mutation<CancellationReason, UpdateCancellationReasonRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/cancellation-reasons/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CancellationReasons', id },
        { type: 'CancellationReasons', id: 'LIST' }
      ]
    }),
    deleteCancellationReason: builder.mutation<void, string>({
      query: id => ({
        url: `/api/cancellation-reasons/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'CancellationReasons', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetCancellationReasonsQuery,
  useLazyGetCancellationReasonsQuery,
  useCreateCancellationReasonMutation,
  useUpdateCancellationReasonMutation,
  useDeleteCancellationReasonMutation
} = adminCancellationReasonsApi
