import { adminApi } from './adminApiBase'
import type { AdminLoginRequest, AdminLoginResponse, AdminRegisterRequest, AdminUser } from '@/types/admin'

export const adminAuthApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: body => ({
        url: '/api/admin/login',
        method: 'POST',
        body
      })
    }),
    adminRegister: builder.mutation<AdminLoginResponse, AdminRegisterRequest>({
      query: body => ({
        url: '/api/admin/register',
        method: 'POST',
        body
      })
    }),
    getAdminMe: builder.query<AdminUser, void>({
      query: () => '/api/admin/me',
      providesTags: [{ type: 'AdminMe', id: 'ME' }]
    })
  }),
  overrideExisting: false
})

export const { useAdminLoginMutation, useAdminRegisterMutation, useGetAdminMeQuery } = adminAuthApi
