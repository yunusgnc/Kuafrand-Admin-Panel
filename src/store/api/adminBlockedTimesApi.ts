import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type {
  BlockedTime,
  BlockedTimeListParams,
  PaginatedResponse,
  CreateBlockedTimeRequest,
  UpdateBlockedTimeRequest
} from '@/types/admin'

const normalizeBlockedTimes = (response: unknown): PaginatedResponse<BlockedTime> => {
  return normalizePaginated<BlockedTime>(response, ['blocked_times', 'blockedTimes', 'data'])
}

export const adminBlockedTimesApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getBlockedTimes: builder.query<PaginatedResponse<BlockedTime>, BlockedTimeListParams>({
      query: params => ({
        url: '/api/blocked-times',
        params
      }),
      transformResponse: (response: unknown) => normalizeBlockedTimes(response),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'BlockedTimes' as const, id })),
              { type: 'BlockedTimes', id: 'LIST' }
            ]
          : [{ type: 'BlockedTimes', id: 'LIST' }]
    }),
    createBlockedTime: builder.mutation<BlockedTime, CreateBlockedTimeRequest>({
      query: body => ({
        url: '/api/blocked-times',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'BlockedTimes', id: 'LIST' }]
    }),
    updateBlockedTime: builder.mutation<BlockedTime, UpdateBlockedTimeRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/blocked-times/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'BlockedTimes', id },
        { type: 'BlockedTimes', id: 'LIST' }
      ]
    }),
    deleteBlockedTime: builder.mutation<void, string>({
      query: id => ({
        url: `/api/blocked-times/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'BlockedTimes', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetBlockedTimesQuery,
  useLazyGetBlockedTimesQuery,
  useCreateBlockedTimeMutation,
  useUpdateBlockedTimeMutation,
  useDeleteBlockedTimeMutation
} = adminBlockedTimesApi
