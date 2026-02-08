'use client'

import { useState } from 'react'
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import AdminTablePage from '@/components/admin/AdminTablePage'
import type { AuditLog } from '@/types/admin'
import { useGetAuditLogsQuery } from '@/store/api/adminApi'

const ACTION_LABELS: Record<string, string> = {
  create: 'Oluşturma',
  update: 'Güncelleme',
  delete: 'Silme',
  login: 'Giriş',
  logout: 'Çıkış'
}

const ENTITY_LABELS: Record<string, string> = {
  admin: 'Admin',
  user: 'Kullanıcı',
  subscription: 'Abonelik',
  config: 'Konfigürasyon',
  role: 'Rol',
  permission: 'İzin'
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('tr-TR')
  } catch {
    return dateStr
  }
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(15)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('')
  const [entityFilter, setEntityFilter] = useState<string>('')

  const { data, isLoading } = useGetAuditLogsQuery({
    page: page + 1,
    limit,
    search: search || undefined,
    action: actionFilter || undefined,
    entity_type: entityFilter || undefined
  })

  return (
    <AdminTablePage<AuditLog>
      title='Audit Log'
      idPrefix='audit-logs'
      rows={data?.data}
      total={data?.total ?? 0}
      page={page}
      rowsPerPage={limit}
      isLoading={isLoading}
      search={search}
      onSearchChange={v => {
        setSearch(v)
        setPage(0)
      }}
      onPageChange={setPage}
      onRowsPerPageChange={v => {
        setLimit(v)
        setPage(0)
      }}
      searchPlaceholder='Admin, entity ara...'
      columns={[
        {
          header: 'Tarih',
          render: row => (
            <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
              {formatDate(row.created_at)}
            </Typography>
          )
        },
        {
          header: 'Aktör',
          render: row => (
            <Typography variant='body2'>
              {row.actor_admin_name || row.actor_admin_id || '-'}
            </Typography>
          )
        },
        {
          header: 'İşlem',
          render: row => (
            <Chip
              size='small'
              label={ACTION_LABELS[row.action as string] || row.action || '-'}
              color={
                row.action === 'delete'
                  ? 'error'
                  : row.action === 'update'
                    ? 'warning'
                    : row.action === 'create'
                      ? 'success'
                      : 'default'
              }
            />
          )
        },
        {
          header: 'Entity',
          render: row => (
            <Chip
              size='small'
              variant='outlined'
              label={ENTITY_LABELS[row.entity_type as string] || row.entity_type || '-'}
            />
          )
        },
        {
          header: 'Entity ID',
          render: row => (
            <Typography variant='body2' color='text.secondary'>
              {row.entity_id || '-'}
            </Typography>
          )
        },
        {
          header: 'IP',
          render: row => (
            <Typography variant='caption' color='text.secondary'>
              {row.ip || '-'}
            </Typography>
          )
        }
      ]}
      toolbar={
        <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>
          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>İşlem</InputLabel>
            <Select
              value={actionFilter}
              label='İşlem'
              onChange={e => {
                setActionFilter(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value=''>Tümü</MenuItem>
              {Object.entries(ACTION_LABELS).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Entity</InputLabel>
            <Select
              value={entityFilter}
              label='Entity'
              onChange={e => {
                setEntityFilter(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value=''>Tümü</MenuItem>
              {Object.entries(ENTITY_LABELS).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      }
    />
  )
}
