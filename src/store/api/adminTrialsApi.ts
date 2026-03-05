import { adminApi } from './adminApiBase'

import type { TrialProvisionRequest, TrialProvisionResponse } from '@/types/admin'

export const adminTrialsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    provisionTrial: builder.mutation<TrialProvisionResponse, TrialProvisionRequest>({
      query: body => ({
        url: '/api/admin/trials/provision',
        method: 'POST',
        body
      }),
      invalidatesTags: [
        { type: 'Subscriptions', id: 'LIST' },
        { type: 'Workplaces', id: 'LIST' },
        { type: 'Workers', id: 'LIST' }
      ]
    })
  }),
  overrideExisting: false
})

export const { useProvisionTrialMutation } = adminTrialsApi
