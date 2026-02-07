import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type { Customer, CustomerListParams, PaginatedResponse, UpdateCustomerRequest } from '@/types/admin'

export const adminUsersApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<PaginatedResponse<Customer>, CustomerListParams>({
      query: params => ({
        url: '/api/admin/users',
        params
      }),
      transformResponse: (response: unknown) => normalizePaginated<Customer>(response, 'users'),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Users' as const, id })), { type: 'Users', id: 'LIST' }]
          : [{ type: 'Users', id: 'LIST' }]
    }),
    updateUser: builder.mutation<Customer, UpdateCustomerRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/users/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' }
      ]
    }),
    deleteUser: builder.mutation<void, string>({
      query: id => ({
        url: `/api/auth/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const { useGetUsersQuery, useLazyGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } = adminUsersApi
