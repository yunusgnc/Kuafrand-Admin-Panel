'use client'

import { useState } from 'react'
import AdminTablePage from '@/components/admin/AdminTablePage'
import type { Appointment } from '@/types/admin'
import { useGetAppointmentsQuery } from '@/store/api/adminApi'

const getDisplayValue = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) return value
  if (typeof value === 'number') return String(value)
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of ['full_name', 'name', 'title', 'email']) {
      const nested = record[key]
      if (typeof nested === 'string' && nested.trim().length > 0) return nested
    }
  }
  return ''
}

const getField = (row: Appointment, keys: string[]): string => {
  for (const key of keys) {
    const value = (row as Record<string, unknown>)[key]
    const display = getDisplayValue(value)
    if (display) return display
  }
  return '-'
}

export default function AdminAppointmentsPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useGetAppointmentsQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  return (
    <AdminTablePage<Appointment>
      title='Randevular'
      idPrefix='appointments'
      rows={data?.data}
      total={data?.total ?? 0}
      page={page}
      rowsPerPage={limit}
      isLoading={isLoading}
      search={search}
      onSearchChange={value => {
        setSearch(value)
        setPage(0)
      }}
      onPageChange={setPage}
      onRowsPerPageChange={value => {
        setLimit(value)
        setPage(0)
      }}
      columns={[
        { header: 'ID', render: row => row.id },
        { header: 'Müşteri', render: row => getField(row, ['customer_name', 'customer', 'customer_full_name']) },
        { header: 'Çalışan', render: row => getField(row, ['worker_name', 'worker', 'worker_full_name']) },
        { header: 'İşyeri', render: row => getField(row, ['workplace_name', 'workplace_title', 'workplace']) },
        { header: 'Hizmet', render: row => getField(row, ['service_name', 'service']) },
        { header: 'Tarih', render: row => getField(row, ['start_at', 'starts_at', 'date']) },
        { header: 'Durum', render: row => getField(row, ['status', 'state']) }
      ]}
    />
  )
}
