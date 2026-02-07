import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type {
  PaginatedResponse,
  Subscription,
  SubscriptionListParams,
  UpdateSubscriptionRequest
} from '@/types/admin'

const normalizeSubscriptions = (response: unknown): PaginatedResponse<Subscription> => {
  return normalizePaginated<Subscription>(response, ['subscriptions', 'data'])
}

export const adminSubscriptionsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getSubscriptions: builder.query<PaginatedResponse<Subscription>, SubscriptionListParams>({
      query: params => ({
        url: '/api/admin/subscriptions',
        params
      }),
      transformResponse: (response: unknown) => normalizeSubscriptions(response),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Subscriptions' as const, id })),
              { type: 'Subscriptions', id: 'LIST' }
            ]
          : [{ type: 'Subscriptions', id: 'LIST' }]
    }),
    updateSubscription: builder.mutation<Subscription, UpdateSubscriptionRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/subscriptions/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Subscriptions', id },
        { type: 'Subscriptions', id: 'LIST' }
      ]
    })
  }),
  overrideExisting: false
})

export const { useGetSubscriptionsQuery, useLazyGetSubscriptionsQuery, useUpdateSubscriptionMutation } =
  adminSubscriptionsApi
