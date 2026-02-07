'use client'

import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField
} from '@mui/material'
import { RiAddLine, RiEditLine } from 'react-icons/ri'
import AdminTablePage from '@/components/admin/AdminTablePage'
import type { FirebaseIdp, CreateFirebaseIdpRequest, UpdateFirebaseIdpRequest } from '@/types/admin'
import {
  useGetFirebaseIdpsQuery,
  useCreateFirebaseIdpMutation,
  useUpdateFirebaseIdpMutation
} from '@/store/api/adminApi'

export default function AdminFirebaseIdpPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateFirebaseIdpRequest>({
    provider_id: '',
    name: '',
    client_id: '',
    client_secret: '',
    is_enabled: true
  })
  const [editForm, setEditForm] = useState<UpdateFirebaseIdpRequest | null>(null)

  const { data, isLoading } = useGetFirebaseIdpsQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [createIdp, { isLoading: isCreating }] = useCreateFirebaseIdpMutation()
  const [updateIdp, { isLoading: isSaving }] = useUpdateFirebaseIdpMutation()

  const handleCreate = async () => {
    if (!createForm.provider_id.trim()) return
    await createIdp({
      ...createForm,
      provider_id: createForm.provider_id.trim(),
      name: createForm.name?.trim() || undefined,
      client_id: createForm.client_id?.trim() || undefined,
      client_secret: createForm.client_secret?.trim() || undefined
    })
    setCreateOpen(false)
    setCreateForm({ provider_id: '', name: '', client_id: '', client_secret: '', is_enabled: true })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateIdp({
      ...editForm,
      name: editForm.name?.trim() || undefined,
      client_id: editForm.client_id?.trim() || undefined,
      client_secret: editForm.client_secret?.trim() || undefined
    })
    setEditForm(null)
  }

  return (
    <>
      <AdminTablePage<FirebaseIdp>
        title='Firebase IdP'
        idPrefix='firebase-idp'
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
            Yeni IdP
          </Button>
        }
        columns={[
          { header: 'ID', render: row => row.id },
          { header: 'Provider', render: row => row.provider_id || '-' },
          { header: 'Ad', render: row => row.name || '-' },
          { header: 'Durum', render: row => (row.is_enabled ? 'Aktif' : 'Pasif') }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton
              size='small'
              onClick={() =>
                setEditForm({
                  id: row.id,
                  name: row.name,
                  client_id: (row as Record<string, unknown>).client_id as string | undefined,
                  client_secret: (row as Record<string, unknown>).client_secret as string | undefined,
                  is_enabled: row.is_enabled
                })
              }
            >
              <RiEditLine size={18} />
            </IconButton>
          </Stack>
        )}
      />

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Yeni Firebase IdP</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Provider ID'
              value={createForm.provider_id}
              onChange={e => setCreateForm(prev => ({ ...prev, provider_id: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Ad'
              value={createForm.name}
              onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Client ID'
              value={createForm.client_id}
              onChange={e => setCreateForm(prev => ({ ...prev, client_id: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Client Secret'
              value={createForm.client_secret}
              onChange={e => setCreateForm(prev => ({ ...prev, client_secret: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              size='small'
              label='Durum'
              value={createForm.is_enabled ? 'active' : 'inactive'}
              onChange={e => setCreateForm(prev => ({ ...prev, is_enabled: e.target.value === 'active' }))}
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
        <DialogTitle>Firebase IdP Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Ad'
              value={editForm?.name ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, name: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Client ID'
              value={editForm?.client_id ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, client_id: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Client Secret'
              value={editForm?.client_secret ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, client_secret: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              select
              size='small'
              label='Durum'
              value={editForm?.is_enabled ? 'active' : 'inactive'}
              onChange={e => setEditForm(prev => (prev ? { ...prev, is_enabled: e.target.value === 'active' } : prev))}
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
    </>
  )
}
