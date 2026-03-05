import { adminApi } from './adminApiBase'

export interface LocationCity {
  id: number
  name: string
}

export interface LocationDistrict {
  id: number
  name: string
}

function normalizeCities(response: unknown): LocationCity[] {
  if (!response || typeof response !== 'object') return []
  const r = response as { cities?: LocationCity[]; data?: LocationCity[] }
  const list = r.cities ?? r.data ?? []

  return Array.isArray(list)
    ? list.map((item: { id?: number; name?: string }) => ({
        id: Number(item.id),
        name: String(item.name ?? '')
      }))
    : []
}

function normalizeDistricts(response: unknown): LocationDistrict[] {
  if (!response || typeof response !== 'object') return []
  const r = response as { districts?: LocationDistrict[]; data?: LocationDistrict[] }
  const list = r.districts ?? r.data ?? []

  return Array.isArray(list)
    ? list.map((item: { id?: number; name?: string }) => ({
        id: Number(item.id),
        name: String(item.name ?? '')
      }))
    : []
}

export const adminLocationsApi = adminApi.injectEndpoints({
  endpoints: builder => ({
    getCities: builder.query<LocationCity[], void>({
      query: () => ({ url: '/api/locations/cities' }),
      transformResponse: (response: unknown) => normalizeCities(response)
    }),
    getDistrictsByCity: builder.query<LocationDistrict[], number>({
      query: cityId => ({ url: `/api/locations/cities/${cityId}/districts` }),
      transformResponse: (response: unknown) => normalizeDistricts(response)
    })
  }),
  overrideExisting: false
})

export const { useGetCitiesQuery, useGetDistrictsByCityQuery } = adminLocationsApi
