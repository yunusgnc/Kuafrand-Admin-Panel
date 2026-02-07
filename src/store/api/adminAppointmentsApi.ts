import { adminApi } from './adminApiBase'
import { normalizePaginated } from './adminApiUtils'
import type { Appointment, AppointmentListParams, PaginatedResponse } from '@/types/admin'

type AppointmentApi = Appointment & {
  id: string
}

const normalizeAppointments = (response: unknown): PaginatedResponse<Appointment> => {
  return normalizePaginated<AppointmentApi>(response, 'appointments')
}

export const adminAppointmentsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getAppointments: builder.query<PaginatedResponse<Appointment>, AppointmentListParams>({
      query: params => ({
        url: '/api/admin/appointments',
        params
      }),
      transformResponse: (response: unknown) => normalizeAppointments(response),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Appointments' as const, id })),
              { type: 'Appointments', id: 'LIST' }
            ]
          : [{ type: 'Appointments', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const { useGetAppointmentsQuery, useLazyGetAppointmentsQuery } = adminAppointmentsApi
