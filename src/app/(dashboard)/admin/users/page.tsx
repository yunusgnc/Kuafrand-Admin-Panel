'use client'

import { useState } from 'react'

import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material'
import { RiSearchLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'

import { useI18n } from '@/hooks/useI18n'
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '@/store/api/adminApi'
import type { Customer, UpdateCustomerRequest } from '@/types/admin'

export default function UsersPage() {
  const { t } = useI18n()
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editForm, setEditForm] = useState<UpdateCustomerRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)
  const searchInputId = 'users-search'
  const statusLabelId = 'users-status-label'
  const statusSelectId = 'users-status'
  const rowsPerPageLabelId = 'users-rows-per-page-label'
  const rowsPerPageSelectId = 'users-rows-per-page'

  const { data, isLoading } = useGetUsersQuery({
    page: page + 1,
    limit,
    search: search || undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active'
  })

  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateUser({ id, is_active: !currentStatus })
  }

  const handleEditOpen = (user: Customer) => {
    setEditForm({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number ?? '',
      is_active: user.is_active
    })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateUser({
      ...editForm,
      phone_number: editForm.phone_number?.trim() ? editForm.phone_number.trim() : null
    })
    setEditForm(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteUser(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        {t('admin.users.title')}
      </Typography>

      <Card>
        <Box sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              size='small'
              placeholder={t('common.search')}
              id={searchInputId}
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(0)
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <RiSearchLine size={18} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{ minWidth: 240 }}
            />
            <FormControl size='small' sx={{ minWidth: 160 }}>
              <InputLabel id={statusLabelId}>{t('common.status')}</InputLabel>
              <Select
                id={statusSelectId}
                labelId={statusLabelId}
                value={statusFilter}
                label={t('common.status')}
                onChange={e => {
                  setStatusFilter(e.target.value)
                  setPage(0)
                }}
              >
                <MenuItem value='all'>{t('admin.users.allStatuses')}</MenuItem>
                <MenuItem value='active'>{t('admin.users.active')}</MenuItem>
                <MenuItem value='inactive'>{t('admin.users.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.users.name')}</TableCell>
                <TableCell>{t('admin.users.email')}</TableCell>
                <TableCell>{t('admin.users.phone')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : data?.data?.map(user => (
                    <TableRow key={user.id} hover>
                      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          size='small'
                          label={user.is_active ? t('admin.users.active') : t('admin.users.inactive')}
                          color={user.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Switch
                            size='small'
                            checked={user.is_active}
                            onChange={() => handleToggleActive(user.id, user.is_active)}
                          />
                          <IconButton size='small' onClick={() => handleEditOpen(user)}>
                            <RiEditLine size={18} />
                          </IconButton>
                          <IconButton size='small' color='error' onClick={() => setDeleteTarget(user)}>
                            <RiDeleteBinLine size={18} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              {!isLoading && (!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>{t('admin.noData')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component='div'
          count={data?.total ?? 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={e => {
            setLimit(parseInt(e.target.value, 10))
            setPage(0)
          }}
          labelRowsPerPage={t('admin.rowsPerPage')}
          SelectProps={{ id: rowsPerPageSelectId, labelId: rowsPerPageLabelId }}
        />
      </Card>

      <Dialog open={!!editForm} onClose={() => setEditForm(null)} fullWidth maxWidth='sm'>
        <DialogTitle>{t('common.edit')}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t('common.firstName')}
              value={editForm?.first_name ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, first_name: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('common.lastName')}
              value={editForm?.last_name ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, last_name: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('admin.users.email')}
              value={editForm?.email ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, email: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('admin.users.phone')}
              value={editForm?.phone_number ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, phone_number: e.target.value } : prev))}
              fullWidth
            />
            <FormControl size='small'>
              <InputLabel>{t('common.status')}</InputLabel>
              <Select
                value={editForm?.is_active ? 'active' : 'inactive'}
                label={t('common.status')}
                onChange={e =>
                  setEditForm(prev =>
                    prev ? { ...prev, is_active: e.target.value === 'active' } : prev
                  )
                }
              >
                <MenuItem value='active'>{t('admin.users.active')}</MenuItem>
                <MenuItem value='inactive'>{t('admin.users.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditForm(null)}>{t('common.cancel')}</Button>
          <Button variant='contained' onClick={handleEditSave} disabled={isSaving}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>{t('admin.users.deleteConfirm')}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
          <Button color='error' variant='contained' onClick={handleDelete} disabled={isDeleting}>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
