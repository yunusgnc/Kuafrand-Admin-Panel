'use client'

import { useMemo, useState } from 'react'
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField
} from '@mui/material'
import { RiAddLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri'
import AdminTablePage from '@/components/admin/AdminTablePage'
import type { CancellationReason, CreateCancellationReasonRequest, UpdateCancellationReasonRequest } from '@/types/admin'
import {
  useGetCancellationReasonsQuery,
  useCreateCancellationReasonMutation,
  useUpdateCancellationReasonMutation,
  useDeleteCancellationReasonMutation
} from '@/store/api/adminApi'

export default function AdminCancellationReasonsPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateCancellationReasonRequest>({
    reason_text: '',
    app_type: 'user',
    is_active: true
  })
  const [editForm, setEditForm] = useState<UpdateCancellationReasonRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CancellationReason | null>(null)

  const { data, isLoading } = useGetCancellationReasonsQuery({})

  const filteredRows = useMemo(() => {
    const list = data?.data ?? []
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter(
      r =>
        (r.reason_text ?? '').toLowerCase().includes(q) ||
        (r.app_type ?? '').toLowerCase().includes(q)
    )
  }, [data?.data, search])

  const paginatedRows = useMemo(() => {
    const start = page * limit
    return filteredRows.slice(start, start + limit)
  }, [filteredRows, page, limit])

  const [createReason, { isLoading: isCreating }] = useCreateCancellationReasonMutation()
  const [updateReason, { isLoading: isSaving }] = useUpdateCancellationReasonMutation()
  const [deleteReason, { isLoading: isDeleting }] = useDeleteCancellationReasonMutation()

  const handleCreate = async () => {
    if (!createForm.reason_text.trim()) return
    await createReason({
      ...createForm,
      reason_text: createForm.reason_text.trim()
    })
    setCreateOpen(false)
    setCreateForm({ reason_text: '', app_type: 'user', is_active: true })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateReason({
      ...editForm,
      reason_text: editForm.reason_text?.trim()
    })
    setEditForm(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteReason(String(deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTablePage<CancellationReason>
        title='İptal Nedenleri'
        idPrefix='cancellation-reasons'
        rows={paginatedRows}
        total={filteredRows.length}
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
            Yeni Neden
          </Button>
        }
        columns={[
          { header: 'ID', render: row => row.id },
          { header: 'Neden', render: row => row.reason_text || '-' },
          {
            header: 'Tip',
            render: row => (
              <Chip
                size='small'
                label={row.app_type === 'owner_worker' ? 'İşletme/Çalışan' : 'Kullanıcı'}
                color={row.app_type === 'owner_worker' ? 'primary' : 'default'}
                variant='outlined'
              />
            )
          },
          {
            header: 'Durum',
            render: row => (
              <Chip
                size='small'
                label={row.is_active ? 'Aktif' : 'Pasif'}
                color={row.is_active ? 'success' : 'default'}
              />
            )
          }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton
              size='small'
              onClick={() =>
                setEditForm({
                  id: row.id,
                  reason_text: row.reason_text,
                  app_type: row.app_type ?? 'user',
                  is_active: row.is_active
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
        <DialogTitle>Yeni İptal Nedeni</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Neden'
              value={createForm.reason_text}
              onChange={e => setCreateForm(prev => ({ ...prev, reason_text: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              size='small'
              label='Uygulama Tipi'
              value={createForm.app_type}
              onChange={e =>
                setCreateForm(prev => ({
                  ...prev,
                  app_type: e.target.value === 'owner_worker' ? 'owner_worker' : 'user'
                }))
              }
            >
              <MenuItem value='user'>Kullanıcı</MenuItem>
              <MenuItem value='owner_worker'>İşletme/Çalışan</MenuItem>
            </TextField>
            <TextField
              select
              size='small'
              label='Durum'
              value={createForm.is_active ? 'active' : 'inactive'}
              onChange={e => setCreateForm(prev => ({ ...prev, is_active: e.target.value === 'active' }))}
            >
              <MenuItem value='active'>Aktif</MenuItem>
              <MenuItem value='inactive'>Pasif</MenuItem>
            </TextField>
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
        <DialogTitle>İptal Nedeni Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Neden'
              value={editForm?.reason_text ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, reason_text: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              select
              size='small'
              label='Uygulama Tipi'
              value={editForm?.app_type ?? 'user'}
              onChange={e =>
                setEditForm(prev =>
                  prev ? { ...prev, app_type: e.target.value === 'owner_worker' ? 'owner_worker' : 'user' } : prev
                )
              }
            >
              <MenuItem value='user'>Kullanıcı</MenuItem>
              <MenuItem value='owner_worker'>İşletme/Çalışan</MenuItem>
            </TextField>
            <TextField
              select
              size='small'
              label='Durum'
              value={editForm?.is_active ? 'active' : 'inactive'}
              onChange={e => setEditForm(prev => (prev ? { ...prev, is_active: e.target.value === 'active' } : prev))}
            >
              <MenuItem value='active'>Aktif</MenuItem>
              <MenuItem value='inactive'>Pasif</MenuItem>
            </TextField>
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
        <DialogContent>Bu nedeni silmek istediğinize emin misiniz?</DialogContent>
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
