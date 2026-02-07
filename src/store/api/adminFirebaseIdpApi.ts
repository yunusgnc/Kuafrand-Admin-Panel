import { adminApi } from './adminApiBase'
import type { FirebaseIdp, FirebaseIdpListParams, CreateFirebaseIdpRequest, UpdateFirebaseIdpRequest, PaginatedResponse } from '@/types/admin'
import { normalizePaginated } from './adminApiUtils'

const normalizeFirebaseIdps = (response: unknown): PaginatedResponse<FirebaseIdp> => {
  return normalizePaginated<FirebaseIdp>(response, ['idps', 'data'])
}

export const adminFirebaseIdpApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getFirebaseIdps: builder.query<PaginatedResponse<FirebaseIdp>, FirebaseIdpListParams>({
      query: params => ({
        url: '/api/admin/firebase/idp',
        params
      }),
      transformResponse: (response: unknown) => normalizeFirebaseIdps(response),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'FirebaseIdp' as const, id })), { type: 'FirebaseIdp', id: 'LIST' }]
          : [{ type: 'FirebaseIdp', id: 'LIST' }]
    }),
    getFirebaseIdp: builder.query<FirebaseIdp, string>({
      query: idpId => `/api/admin/firebase/idp/${idpId}`,
      providesTags: (_result, _error, idpId) => [{ type: 'FirebaseIdp', id: idpId }]
    }),
    createFirebaseIdp: builder.mutation<FirebaseIdp, CreateFirebaseIdpRequest>({
      query: body => ({
        url: '/api/admin/firebase/idp',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'FirebaseIdp', id: 'LIST' }]
    }),
    updateFirebaseIdp: builder.mutation<FirebaseIdp, UpdateFirebaseIdpRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/firebase/idp/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'FirebaseIdp', id },
        { type: 'FirebaseIdp', id: 'LIST' }
      ]
    })
  }),
  overrideExisting: false
})

export const {
  useGetFirebaseIdpsQuery,
  useLazyGetFirebaseIdpsQuery,
  useGetFirebaseIdpQuery,
  useLazyGetFirebaseIdpQuery,
  useCreateFirebaseIdpMutation,
  useUpdateFirebaseIdpMutation
} = adminFirebaseIdpApi
