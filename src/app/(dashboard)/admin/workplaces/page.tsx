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
  Stack,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  MenuItem
} from '@mui/material'
import { RiSearchLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri'

import { useI18n } from '@/hooks/useI18n'
import { useAppSelector } from '@/store/hooks'
import {
  useGetWorkplacesQuery,
  useUpdateWorkplaceMutation,
  useDeleteWorkplaceMutation
} from '@/store/api/adminApi'
import type { Workplace, UpdateWorkplaceRequest } from '@/types/admin'

export default function WorkplacesPage() {
  const { t } = useI18n()
  const user = useAppSelector(state => state.auth.user)
  const isSuperAdmin = user?.is_super_admin ?? false

  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UpdateWorkplaceRequest | null>(null)
  const searchInputId = 'workplaces-search'
  const rowsPerPageLabelId = 'workplaces-rows-per-page-label'
  const rowsPerPageSelectId = 'workplaces-rows-per-page'

  const { data, isLoading } = useGetWorkplacesQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [updateWorkplace, { isLoading: isSaving }] = useUpdateWorkplaceMutation()
  const [deleteWorkplace, { isLoading: isDeleting }] = useDeleteWorkplaceMutation()

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateWorkplace({ id, is_active: !currentStatus })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteWorkplace(deleteTarget)
    setDeleteTarget(null)
  }

  const handleEditOpen = (workplace: Workplace) => {
    setEditForm({
      id: workplace.id,
      title: workplace.name,
      address: workplace.address ?? '',
      phone: workplace.phone ?? '',
      industry_type_id: workplace.industry_type_id ?? null,
      is_active: workplace.is_active
    })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateWorkplace({
      ...editForm,
      title: editForm.title?.trim() || undefined,
      address: editForm.address?.trim() ? editForm.address.trim() : null,
      phone: editForm.phone?.trim() ? editForm.phone.trim() : null,
      industry_type_id: editForm.industry_type_id ?? null
    })
    setEditForm(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        {t('admin.workplaces.title')}
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
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.workplaces.name')}</TableCell>
                <TableCell>{t('admin.workplaces.industry')}</TableCell>
                <TableCell>{t('admin.workplaces.phone')}</TableCell>
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
                : data?.data?.map(wp => (
                    <TableRow key={wp.id} hover>
                      <TableCell>{wp.name}</TableCell>
                      <TableCell>{wp.industry_type_id ?? '-'}</TableCell>
                      <TableCell>{wp.phone || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          size='small'
                          label={wp.is_active ? t('admin.workplaces.active') : t('admin.workplaces.inactive')}
                          color={wp.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Switch
                            size='small'
                            checked={wp.is_active}
                            onChange={() => handleToggleActive(wp.id, wp.is_active)}
                          />
                          <IconButton size='small' onClick={() => handleEditOpen(wp)}>
                            <RiEditLine size={18} />
                          </IconButton>
                          {isSuperAdmin && (
                            <IconButton size='small' color='error' onClick={() => setDeleteTarget(wp.id)}>
                              <RiDeleteBinLine size={18} />
                            </IconButton>
                          )}
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

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('admin.workplaces.deleteConfirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
          <Button color='error' variant='contained' onClick={handleDelete} disabled={isDeleting}>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editForm}
        onClose={() => {
          setEditForm(null)
        }}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>{t('common.edit')}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t('admin.workplaces.name')}
              value={editForm?.title ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, title: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('admin.workplaces.address')}
              value={editForm?.address ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, address: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('admin.workplaces.phone')}
              value={editForm?.phone ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, phone: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('admin.workplaces.industry')}
              type='number'
              value={editForm?.industry_type_id ?? ''}
              onChange={e =>
                setEditForm(prev =>
                  prev ? { ...prev, industry_type_id: e.target.value ? Number(e.target.value) : null } : prev
                )
              }
              fullWidth
            />
            <TextField
              select
              size='small'
              label={t('common.status')}
              value={editForm?.is_active ? 'active' : 'inactive'}
              onChange={e =>
                setEditForm(prev =>
                  prev ? { ...prev, is_active: e.target.value === 'active' } : prev
                )
              }
            >
              <MenuItem value='active'>{t('admin.workplaces.active')}</MenuItem>
              <MenuItem value='inactive'>{t('admin.workplaces.inactive')}</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditForm(null)}>
            {t('common.cancel')}
          </Button>
          <Button variant='contained' onClick={handleEditSave} disabled={isSaving}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
