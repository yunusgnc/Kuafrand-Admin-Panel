'use client'

import { useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField
} from '@mui/material'
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri'

import AdminTablePage from '@/components/admin/AdminTablePage'
import type { AppointmentCancellation, UpdateAppointmentCancellationRequest } from '@/types/admin'
import {
  useGetAppointmentCancellationsQuery,
  useUpdateAppointmentCancellationMutation,
  useDeleteAppointmentCancellationMutation
} from '@/store/api/adminApi'

export default function AdminAppointmentCancellationsPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [editForm, setEditForm] = useState<UpdateAppointmentCancellationRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AppointmentCancellation | null>(null)

  const { data, isLoading } = useGetAppointmentCancellationsQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [updateCancellation, { isLoading: isSaving }] = useUpdateAppointmentCancellationMutation()
  const [deleteCancellation, { isLoading: isDeleting }] = useDeleteAppointmentCancellationMutation()

  const handleEditSave = async () => {
    if (!editForm) return
    await updateCancellation(editForm)
    setEditForm(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteCancellation(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTablePage<AppointmentCancellation>
        title='Randevu İptalleri'
        idPrefix='appointment-cancellations'
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
          { header: 'Randevu ID', render: row => row.appointment_id || '-' },
          { header: 'Neden ID', render: row => row.reason_id || '-' },
          { header: 'Durum', render: row => String((row as Record<string, unknown>).status ?? '-') }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton
              size='small'
              onClick={() =>
                setEditForm({
                  id: row.id,
                  reason_id: row.reason_id,
                  status: (row as Record<string, unknown>).status as string | undefined
                })
              }
            >
              <RiEditLine size={18} />
            </IconButton>
            <IconButton size='small' color='error' onClick={() => setDeleteTarget(row)}>
              <RiDeleteBinLine size={18} />
            </IconButton>
          </Stack>
        )}
      />

      <Dialog open={!!editForm} onClose={() => setEditForm(null)} fullWidth maxWidth='sm'>
        <DialogTitle>İptal Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Neden ID'
              value={editForm?.reason_id ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, reason_id: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Durum'
              value={editForm?.status ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, status: e.target.value } : prev))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditForm(null)}>İptal</Button>
          <Button variant='contained' onClick={handleEditSave} disabled={isSaving}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>Bu iptal kaydını silmek istediğinize emin misiniz?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>İptal</Button>
          <Button color='error' variant='contained' onClick={handleDelete} disabled={isDeleting}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
