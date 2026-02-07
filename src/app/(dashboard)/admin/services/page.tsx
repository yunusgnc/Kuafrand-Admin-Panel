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
import { RiAddLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import AdminTablePage from '@/components/admin/AdminTablePage'
import type { Service, CreateServiceRequest, UpdateServiceRequest } from '@/types/admin'
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation
} from '@/store/api/adminApi'

export default function AdminServicesPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateServiceRequest>({ name: '', description: '' })
  const [editForm, setEditForm] = useState<UpdateServiceRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const { data, isLoading } = useGetServicesQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation()
  const [updateService, { isLoading: isSaving }] = useUpdateServiceMutation()
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()

  const handleCreate = async () => {
    if (!createForm.name.trim()) return
    if (!createForm.description.trim()) return
    await createService({
      name: createForm.name.trim(),
      description: createForm.description.trim()
    })
    setCreateOpen(false)
    setCreateForm({ name: '', description: '' })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateService({
      ...editForm,
      name: editForm.name?.trim(),
      description: editForm.description?.trim()
    })
    setEditForm(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteService(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTablePage<Service>
        title='Hizmetler'
        idPrefix='services'
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
            Yeni Hizmet
          </Button>
        }
        columns={[
          { header: 'ID', render: row => row.id },
          { header: 'Ad', render: row => row.name },
          { header: 'Açıklama', render: row => row.description || '-' }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton
              size='small'
              onClick={() =>
                setEditForm({
                  id: row.id,
                  name: row.name,
                  description: row.description
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
        <DialogTitle>Yeni Hizmet</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Hizmet Adı'
              value={createForm.name}
              onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Açıklama'
              value={createForm.description}
              onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              minRows={3}
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
        <DialogTitle>Hizmet Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Hizmet Adı'
              value={editForm?.name ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, name: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Açıklama'
              value={editForm?.description ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, description: e.target.value } : prev))}
              multiline
              minRows={3}
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
        <DialogContent>Bu hizmeti silmek istediğinize emin misiniz?</DialogContent>
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
