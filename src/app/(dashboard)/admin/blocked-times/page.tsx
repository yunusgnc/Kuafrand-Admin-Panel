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
import type { BlockedTime, CreateBlockedTimeRequest, UpdateBlockedTimeRequest } from '@/types/admin'
import {
  useGetBlockedTimesQuery,
  useCreateBlockedTimeMutation,
  useUpdateBlockedTimeMutation,
  useDeleteBlockedTimeMutation
} from '@/store/api/adminApi'

export default function AdminBlockedTimesPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateBlockedTimeRequest>({
    worker_id: '',
    workplace_id: '',
    start_at: '',
    end_at: '',
    reason: ''
  })
  const [editForm, setEditForm] = useState<UpdateBlockedTimeRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BlockedTime | null>(null)

  const { data, isLoading } = useGetBlockedTimesQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [createBlockedTime, { isLoading: isCreating }] = useCreateBlockedTimeMutation()
  const [updateBlockedTime, { isLoading: isSaving }] = useUpdateBlockedTimeMutation()
  const [deleteBlockedTime, { isLoading: isDeleting }] = useDeleteBlockedTimeMutation()

  const handleCreate = async () => {
    if (!createForm.start_at || !createForm.end_at) return
    await createBlockedTime({
      ...createForm,
      worker_id: createForm.worker_id?.trim() || undefined,
      workplace_id: createForm.workplace_id?.trim() || undefined,
      reason: createForm.reason?.trim() || undefined
    })
    setCreateOpen(false)
    setCreateForm({ worker_id: '', workplace_id: '', start_at: '', end_at: '', reason: '' })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateBlockedTime({
      ...editForm,
      worker_id: editForm.worker_id?.trim() || undefined,
      workplace_id: editForm.workplace_id?.trim() || undefined,
      reason: editForm.reason?.trim() || undefined
    })
    setEditForm(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteBlockedTime(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTablePage<BlockedTime>
        title='Kapalı Zamanlar'
        idPrefix='blocked-times'
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
            Yeni Kayıt
          </Button>
        }
        columns={[
          { header: 'ID', render: row => row.id },
          { header: 'Çalışan ID', render: row => row.worker_id || '-' },
          { header: 'İşyeri ID', render: row => row.workplace_id || '-' },
          { header: 'Başlangıç', render: row => row.start_at || '-' },
          { header: 'Bitiş', render: row => row.end_at || '-' }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton
              size='small'
              onClick={() =>
                setEditForm({
                  id: row.id,
                  worker_id: row.worker_id,
                  workplace_id: row.workplace_id,
                  start_at: row.start_at,
                  end_at: row.end_at,
                  reason: row.reason
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
        <DialogTitle>Kapalı Zaman Ekle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Çalışan ID'
              value={createForm.worker_id}
              onChange={e => setCreateForm(prev => ({ ...prev, worker_id: e.target.value }))}
              fullWidth
            />
            <TextField
              label='İşyeri ID'
              value={createForm.workplace_id}
              onChange={e => setCreateForm(prev => ({ ...prev, workplace_id: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Başlangıç'
              value={createForm.start_at}
              onChange={e => setCreateForm(prev => ({ ...prev, start_at: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Bitiş'
              value={createForm.end_at}
              onChange={e => setCreateForm(prev => ({ ...prev, end_at: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Sebep'
              value={createForm.reason}
              onChange={e => setCreateForm(prev => ({ ...prev, reason: e.target.value }))}
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
        <DialogTitle>Kapalı Zaman Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Çalışan ID'
              value={editForm?.worker_id ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, worker_id: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='İşyeri ID'
              value={editForm?.workplace_id ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, workplace_id: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Başlangıç'
              value={editForm?.start_at ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, start_at: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Bitiş'
              value={editForm?.end_at ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, end_at: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Sebep'
              value={editForm?.reason ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, reason: e.target.value } : prev))}
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
        <DialogContent>Bu kaydı silmek istediğinize emin misiniz?</DialogContent>
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
