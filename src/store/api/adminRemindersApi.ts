import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type { PaginatedResponse, Reminder, ReminderListParams, CreateReminderRequest, UpdateReminderRequest } from '@/types/admin'

const normalizeReminders = (response: unknown): PaginatedResponse<Reminder> => {
  return normalizePaginated<Reminder>(response, ['reminders', 'data'])
}

export const adminRemindersApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getReminders: builder.query<PaginatedResponse<Reminder>, ReminderListParams>({
      query: params => ({
        url: '/api/reminders',
        params
      }),
      transformResponse: (response: unknown) => normalizeReminders(response),
      providesTags: result =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Reminders' as const, id })), { type: 'Reminders', id: 'LIST' }]
          : [{ type: 'Reminders', id: 'LIST' }]
    }),
    createReminder: builder.mutation<Reminder, CreateReminderRequest>({
      query: body => ({
        url: '/api/reminders',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Reminders', id: 'LIST' }]
    }),
    updateReminder: builder.mutation<Reminder, UpdateReminderRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/reminders/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Reminders', id },
        { type: 'Reminders', id: 'LIST' }
      ]
    }),
    deleteReminder: builder.mutation<void, string>({
      query: id => ({
        url: `/api/reminders/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Reminders', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetRemindersQuery,
  useLazyGetRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation
} = adminRemindersApi
