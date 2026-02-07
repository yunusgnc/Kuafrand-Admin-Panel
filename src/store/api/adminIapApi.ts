import { adminApi } from './adminApiBase'
import type { AppleVerifyBatchRequest, AppleVerifyBatchResponse } from '@/types/admin'

export const adminIapApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    verifyAppleBatch: builder.mutation<AppleVerifyBatchResponse, AppleVerifyBatchRequest>({
      query: body => ({
        url: '/api/iap/apple/verify-batch',
        method: 'POST',
        body
      })
    })
  }),
  overrideExisting: false
})

export const { useVerifyAppleBatchMutation } = adminIapApi
