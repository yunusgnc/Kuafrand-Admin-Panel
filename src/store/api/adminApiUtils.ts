import type { ApiPagination, PaginatedResponse } from '@/types/admin'

export const coerceBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1'
  if (typeof value === 'number') return value === 1
  return false
}

export const coerceNumber = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  if (typeof value === 'boolean') return value ? 1 : 0
  return 0
}

export const normalizePaginated = <T>(response: unknown, keys: string[] | string): PaginatedResponse<T> => {
  if (Array.isArray(response)) {
    return { data: response as T[], total: response.length }
  }

  const res = (response ?? {}) as Record<string, unknown>
  const keyList = Array.isArray(keys) ? keys : [keys]

  let data: T[] = []

  for (const key of keyList) {
    const value = res[key]
    if (Array.isArray(value)) {
      data = value as T[]
      break
    }
  }

  if (data.length === 0 && Array.isArray(res.data)) {
    data = res.data as T[]
  }

  const pagination = res.pagination as ApiPagination | undefined

  return { data, total: pagination?.total_count ?? data.length }
}

export const normalizeList = <T>(response: unknown, keys: string[] = ['data']): T[] => {
  if (Array.isArray(response)) return response as T[]
  if (!response || typeof response !== 'object') return []
  const record = response as Record<string, unknown>
  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) return value as T[]
  }
  return []
}
