import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type {
  AdminUser,
  AdminListParams,
  PaginatedResponse,
  UpdateAdminRequest,
  ResetAdminPasswordRequest
} from '@/types/admin'

const normalizeAdmins = (response: unknown): PaginatedResponse<AdminUser> => {
  return normalizePaginated<AdminUser>(response, ['admins', 'data'])
}

export const adminAdminsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getAdmins: builder.query<PaginatedResponse<AdminUser>, AdminListParams>({
      query: params => ({
        url: '/api/admin/admins',
        params
      }),
      transformResponse: (response: unknown) => normalizeAdmins(response),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Admins' as const, id })), { type: 'Admins', id: 'LIST' }]
          : [{ type: 'Admins', id: 'LIST' }]
    }),
    getAdmin: builder.query<AdminUser, string>({
      query: id => `/api/admin/admins/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Admins', id }]
    }),
    updateAdmin: builder.mutation<AdminUser, UpdateAdminRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/admins/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Admins', id },
        { type: 'Admins', id: 'LIST' }
      ]
    }),
    resetAdminPassword: builder.mutation<{ message?: string }, ResetAdminPasswordRequest>({
      query: ({ id, password }) => ({
        url: `/api/admin/admins/${id}/reset-password`,
        method: 'POST',
        body: password ? { password } : {}
      })
    }),
    deleteAdmin: builder.mutation<void, string>({
      query: id => ({
        url: `/api/admin/admins/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Admins', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetAdminsQuery,
  useLazyGetAdminsQuery,
  useGetAdminQuery,
  useUpdateAdminMutation,
  useResetAdminPasswordMutation,
  useDeleteAdminMutation
} = adminAdminsApi
