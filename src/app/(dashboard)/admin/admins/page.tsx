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
  TextField,
  Chip,
  Switch
} from '@mui/material'
import { RiDeleteBinLine, RiEditLine, RiKeyLine } from 'react-icons/ri'
import AdminTablePage from '@/components/admin/AdminTablePage'
import type { AdminUser, UpdateAdminRequest, ResetAdminPasswordRequest } from '@/types/admin'
import {
  useGetAdminsQuery,
  useUpdateAdminMutation,
  useResetAdminPasswordMutation,
  useDeleteAdminMutation
} from '@/store/api/adminApi'

export default function AdminAdminsPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [editForm, setEditForm] = useState<UpdateAdminRequest | null>(null)
  const [resetForm, setResetForm] = useState<ResetAdminPasswordRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [resetPassword, setResetPassword] = useState('')

  const { data, isLoading } = useGetAdminsQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [updateAdmin, { isLoading: isSaving }] = useUpdateAdminMutation()
  const [resetAdminPassword, { isLoading: isResetting }] = useResetAdminPasswordMutation()
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation()

  const handleEditSave = async () => {
    if (!editForm) return
    await updateAdmin({
      ...editForm,
      first_name: editForm.first_name?.trim(),
      last_name: editForm.last_name?.trim(),
      phone_number: editForm.phone_number?.trim()
    })
    setEditForm(null)
  }

  const handleResetPassword = async () => {
    if (!resetForm || !resetPassword.trim()) return
    await resetAdminPassword({ id: resetForm.id, password: resetPassword.trim() })
    setResetForm(null)
    setResetPassword('')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteAdmin(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTablePage<AdminUser>
        title='Admin Yönetimi'
        idPrefix='admins'
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
          { header: 'Ad Soyad', render: row => `${row.first_name} ${row.last_name}` },
          { header: 'E-posta', render: row => row.email },
          { header: 'Telefon', render: row => row.phone_number || '-' },
          {
            header: 'Rol',
            render: row => (
              <Chip size='small' color={row.is_super_admin ? 'primary' : 'default'} label={row.is_super_admin ? 'Süper Admin' : 'Admin'} />
            )
          },
          {
            header: 'Durum',
            render: row => <Chip size='small' color={row.is_active ? 'success' : 'default'} label={row.is_active ? 'Aktif' : 'Pasif'} />
          }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end' alignItems='center'>
            <Switch
              size='small'
              checked={row.is_active}
              onChange={() => updateAdmin({ id: row.id, is_active: !row.is_active })}
            />
            <IconButton size='small' onClick={() => setEditForm({ id: row.id, first_name: row.first_name, last_name: row.last_name, phone_number: row.phone_number, is_active: row.is_active, is_super_admin: row.is_super_admin })}>
              <RiEditLine size={18} />
            </IconButton>
            <IconButton size='small' onClick={() => setResetForm({ id: row.id })}>
              <RiKeyLine size={18} />
            </IconButton>
            <IconButton size='small' color='error' onClick={() => setDeleteTarget(row)}>
              <RiDeleteBinLine size={18} />
            </IconButton>
          </Stack>
        )}
      />

      <Dialog open={!!editForm} onClose={() => setEditForm(null)} fullWidth maxWidth='sm'>
        <DialogTitle>Admin Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Ad'
              value={editForm?.first_name ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, first_name: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Soyad'
              value={editForm?.last_name ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, last_name: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label='Telefon'
              value={editForm?.phone_number ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, phone_number: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              select
              size='small'
              label='Rol'
              value={editForm?.is_super_admin ? 'super' : 'admin'}
              onChange={e =>
                setEditForm(prev => (prev ? { ...prev, is_super_admin: e.target.value === 'super' } : prev))
              }
            >
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='super'>Süper Admin</MenuItem>
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

      <Dialog open={!!resetForm} onClose={() => setResetForm(null)} fullWidth maxWidth='sm'>
        <DialogTitle>Şifre Sıfırla</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Yeni Şifre'
              type='password'
              value={resetPassword}
              onChange={e => setResetPassword(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetForm(null)}>İptal</Button>
          <Button variant='contained' onClick={handleResetPassword} disabled={isResetting}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>Bu admini silmek istediğinize emin misiniz?</DialogContent>
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
