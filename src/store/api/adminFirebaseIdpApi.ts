import { adminApi } from './adminApiBase'
import type { FirebaseIdpResponse } from '@/types/admin'

const normalizeFirebaseIdpResponse = (response: unknown): FirebaseIdpResponse => {
  if (response && typeof response === 'object') {
    const record = response as Record<string, unknown>

    
return {
      message: (record.message as string) ?? '',
      idpConfigs: (record.idpConfigs as FirebaseIdpResponse['idpConfigs']) ?? [],
      supportedProviders: (record.supportedProviders as FirebaseIdpResponse['supportedProviders']) ?? {}
    }
  }

  
return { message: '', idpConfigs: [], supportedProviders: {} }
}

export const adminFirebaseIdpApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getFirebaseIdps: builder.query<FirebaseIdpResponse, void>({
      query: () => '/api/admin/firebase/idp',
      transformResponse: (response: unknown) => normalizeFirebaseIdpResponse(response),
      providesTags: [{ type: 'FirebaseIdp', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const { useGetFirebaseIdpsQuery } = adminFirebaseIdpApi
