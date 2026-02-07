import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type {
  PaginatedResponse,
  AppointmentCancellation,
  AppointmentCancellationListParams,
  UpdateAppointmentCancellationRequest
} from '@/types/admin'

const normalizeAppointmentCancellations = (response: unknown): PaginatedResponse<AppointmentCancellation> => {
  return normalizePaginated<AppointmentCancellation>(response, [
    'appointment_cancellations',
    'appointmentCancellations',
    'data'
  ])
}

export const adminAppointmentCancellationsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getAppointmentCancellations: builder.query<PaginatedResponse<AppointmentCancellation>, AppointmentCancellationListParams>({
      query: params => ({
        url: '/api/appointment-cancellations',
        params
      }),
      transformResponse: (response: unknown) => normalizeAppointmentCancellations(response),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'AppointmentCancellations' as const, id })),
              { type: 'AppointmentCancellations', id: 'LIST' }
            ]
          : [{ type: 'AppointmentCancellations', id: 'LIST' }]
    }),
    updateAppointmentCancellation: builder.mutation<AppointmentCancellation, UpdateAppointmentCancellationRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/appointment-cancellations/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AppointmentCancellations', id },
        { type: 'AppointmentCancellations', id: 'LIST' }
      ]
    }),
    deleteAppointmentCancellation: builder.mutation<void, string>({
      query: id => ({
        url: `/api/appointment-cancellations/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'AppointmentCancellations', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetAppointmentCancellationsQuery,
  useLazyGetAppointmentCancellationsQuery,
  useUpdateAppointmentCancellationMutation,
  useDeleteAppointmentCancellationMutation
} = adminAppointmentCancellationsApi
