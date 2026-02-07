import { adminApi } from './adminApiBase'
import { normalizeList } from './adminApiUtils'
import type {
  Permission,
  Role,
  RoleDetail,
  UpdateRolePermissionsRequest,
  WorkerPermissions,
  UpdateWorkerRoleRequest,
  UpdateWorkerOverridesRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest
} from '@/types/admin'

export const adminPermissionsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getPermissions: builder.query<Permission[], void>({
      query: () => '/api/permissions',
      transformResponse: (response: unknown) => normalizeList<Permission>(response, ['permissions', 'data']),
      providesTags: [{ type: 'Permissions', id: 'LIST' }]
    }),
    getRoles: builder.query<Role[], void>({
      query: () => '/api/permissions/roles',
      transformResponse: (response: unknown) => normalizeList<Role>(response, ['roles', 'data']),
      providesTags: result =>
        Array.isArray(result)
          ? [...result.map(({ id }) => ({ type: 'Roles' as const, id })), { type: 'Roles', id: 'LIST' }]
          : [{ type: 'Roles', id: 'LIST' }]
    }),
    getRoleDetail: builder.query<RoleDetail, number>({
      query: roleId => `/api/permissions/roles/${roleId}`,
      providesTags: (_result, _error, roleId) => [{ type: 'Roles', id: roleId }]
    }),
    updateRolePermissions: builder.mutation<RoleDetail, UpdateRolePermissionsRequest>({
      query: ({ roleId, ...body }) => ({
        url: `/api/permissions/roles/${roleId}/permissions`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Roles', id: roleId },
        { type: 'Roles', id: 'LIST' }
      ]
    }),
    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: body => ({
        url: '/api/permissions/roles',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }]
    }),
    updateRole: builder.mutation<Role, UpdateRoleRequest>({
      query: ({ roleId, ...body }) => ({
        url: `/api/permissions/roles/${roleId}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Roles', id: roleId },
        { type: 'Roles', id: 'LIST' }
      ]
    }),
    createPermission: builder.mutation<Permission, CreatePermissionRequest>({
      query: body => ({
        url: '/api/permissions',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Permissions', id: 'LIST' }]
    }),
    updatePermission: builder.mutation<Permission, UpdatePermissionRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/permissions/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Permissions', id },
        { type: 'Permissions', id: 'LIST' }
      ]
    }),
    getWorkerPermissions: builder.query<WorkerPermissions, string>({
      query: workerId => `/api/permissions/workers/${workerId}`,
      providesTags: (_result, _error, workerId) => [{ type: 'WorkerPermissions', id: workerId }]
    }),
    updateWorkerRole: builder.mutation<WorkerPermissions, UpdateWorkerRoleRequest>({
      query: ({ workerId, ...body }) => ({
        url: `/api/permissions/workers/${workerId}/role`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { workerId }) => [
        { type: 'WorkerPermissions', id: workerId },
        { type: 'Workers', id: workerId }
      ]
    }),
    updateWorkerOverrides: builder.mutation<WorkerPermissions, UpdateWorkerOverridesRequest>({
      query: ({ workerId, ...body }) => ({
        url: `/api/permissions/workers/${workerId}/overrides`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { workerId }) => [{ type: 'WorkerPermissions', id: workerId }]
    }),
    getPermissionsMe: builder.query<Permission[], void>({
      query: () => '/api/permissions/me',
      transformResponse: (response: unknown) => normalizeList<Permission>(response, ['permissions', 'data']),
      providesTags: [{ type: 'Permissions', id: 'ME' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetPermissionsQuery,
  useGetRolesQuery,
  useGetRoleDetailQuery,
  useLazyGetRoleDetailQuery,
  useUpdateRolePermissionsMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useGetWorkerPermissionsQuery,
  useLazyGetWorkerPermissionsQuery,
  useUpdateWorkerRoleMutation,
  useUpdateWorkerOverridesMutation,
  useGetPermissionsMeQuery
} = adminPermissionsApi
