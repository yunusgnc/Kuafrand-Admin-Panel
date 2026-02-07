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
import { RiAddLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri'
import AdminTablePage from '@/components/admin/AdminTablePage'
import type { Reminder, CreateReminderRequest, UpdateReminderRequest } from '@/types/admin'
import {
  useGetRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation
} from '@/store/api/adminApi'

export default function AdminRemindersPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateReminderRequest>({
    appointment_id: '',
    message: '',
    send_at: '',
    type: ''
  })
  const [editForm, setEditForm] = useState<UpdateReminderRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null)

  const { data, isLoading } = useGetRemindersQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation()
  const [updateReminder, { isLoading: isSaving }] = useUpdateReminderMutation()
  const [deleteReminder, { isLoading: isDeleting }] = useDeleteReminderMutation()

  const handleCreate = async () => {
    if (!createForm.appointment_id.trim()) return
    await createReminder({
      ...createForm,
      appointment_id: createForm.appointment_id.trim(),
      message: createForm.message?.trim() || undefined,
      send_at: createForm.send_at?.trim() || undefined,
      type: createForm.type?.trim() || undefined
    })
    setCreateOpen(false)
    setCreateForm({ appointment_id: '', message: '', send_at: '', type: '' })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateReminder({
      ...editForm,
      message: editForm.message?.trim() || undefined,
      send_at: editForm.send_at?.trim() || undefined,
      type: editForm.type?.trim() || undefined
    })
    setEditForm(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteReminder(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTablePage<Reminder>
        title='Hatırlatmalar'
        idPrefix='reminders'
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
        toolbar={
          <Button variant='contained' startIcon={<RiAddLine />} onClick={() => setCreateOpen(true)}>
            Yeni Hatırlatma
          </Button>
        }
        columns={[
          { header: 'ID', render: row => row.id },
          { header: 'Randevu ID', render: row => row.appointment_id || '-' },
          { header: 'Tip', render: row => row.type || '-' },
          { header: 'Gönderim', render: row => row.send_at || '-' }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton
              size='small'
              onClick={() =>
                setEditForm({
                  id: row.id,
                  message: row.message,
                  send_at: row.send_at,
                  type: row.type
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

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Yeni Hatırlatma</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Randevu ID'
              value={createForm.appointment_id}
              onChange={e => setCreateForm(prev => ({ ...prev, appointment_id: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Tip'
              value={createForm.type}
              onChange={e => setCreateForm(prev => ({ ...prev, type: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Mesaj'
              value={createForm.message}
              onChange={e => setCreateForm(prev => ({ ...prev, message: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Gönderim Zamanı'
              value={createForm.send_at}
              onChange={e => setCreateForm(prev => ({ ...prev, send_at: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>İptal</Button>
          <Button variant='contained' onClick={handleCreate} disabled={isCreating}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editForm} onClose={() => setEditForm(null)} fullWidth maxWidth='sm'>
        <DialogTitle>Hatırlatma Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Tip'
              value={editForm?.type ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, type: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Mesaj'
              value={editForm?.message ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, message: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Gönderim Zamanı'
              value={editForm?.send_at ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, send_at: e.target.value } : prev))}
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
        <DialogContent>Bu hatırlatmayı silmek istediğinize emin misiniz?</DialogContent>
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
