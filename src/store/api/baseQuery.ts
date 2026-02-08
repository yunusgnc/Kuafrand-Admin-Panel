import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { RootState } from '@/store'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ''

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Content-Type', 'application/json')
    
return headers
  }
})
