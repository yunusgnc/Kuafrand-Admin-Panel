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
import type { Industry, CreateIndustryRequest, UpdateIndustryRequest } from '@/types/admin'
import {
  useGetIndustriesQuery,
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation
} from '@/store/api/adminApi'

export default function AdminIndustriesPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [editForm, setEditForm] = useState<UpdateIndustryRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Industry | null>(null)
  const [createForm, setCreateForm] = useState<CreateIndustryRequest>({ type: '' })

  const { data, isLoading } = useGetIndustriesQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [createIndustry, { isLoading: isCreating }] = useCreateIndustryMutation()
  const [updateIndustry, { isLoading: isSaving }] = useUpdateIndustryMutation()
  const [deleteIndustry, { isLoading: isDeleting }] = useDeleteIndustryMutation()

  const handleCreate = async () => {
    if (!createForm.type.trim()) return
    await createIndustry({ type: createForm.type.trim() })
    setCreateOpen(false)
    setCreateForm({ type: '' })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateIndustry({
      ...editForm,
      type: editForm.type?.trim()
    })
    setEditForm(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteIndustry(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTablePage<Industry>
        title='Sektörler'
        idPrefix='industries'
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
            Yeni Sektör
          </Button>
        }
        columns={[
          { header: 'ID', render: row => row.id },
          { header: 'Tür', render: row => row.type }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton size='small' onClick={() => setEditForm({ id: row.id, type: row.type })}>
              <RiEditLine size={18} />
            </IconButton>
            <IconButton size='small' color='error' onClick={() => setDeleteTarget(row)}>
              <RiDeleteBinLine size={18} />
            </IconButton>
          </Stack>
        )}
      />

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Yeni Sektör</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Sektör Türü'
              value={createForm.type}
              onChange={e => setCreateForm(prev => ({ ...prev, type: e.target.value }))}
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
        <DialogTitle>Sektör Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Sektör Türü'
              value={editForm?.type ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, type: e.target.value } : prev))}
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
        <DialogContent>Bu sektörü silmek istediğinize emin misiniz?</DialogContent>
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
