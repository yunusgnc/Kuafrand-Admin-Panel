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
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  MenuItem
} from '@mui/material'
import { RiSearchLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import { useI18n } from '@/hooks/useI18n'
import { useGetWorkersQuery, useUpdateWorkerMutation, useDeleteWorkerMutation } from '@/store/api/adminApi'
import type { Worker, UpdateWorkerRequest } from '@/types/admin'

export default function WorkersPage() {
  const { t } = useI18n()
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'owners'>('all')
  const [editTarget, setEditTarget] = useState<Worker | null>(null)
  const [editForm, setEditForm] = useState<UpdateWorkerRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Worker | null>(null)
  const searchInputId = 'workers-search'
  const rowsPerPageLabelId = 'workers-rows-per-page-label'
  const rowsPerPageSelectId = 'workers-rows-per-page'

  const { data, isLoading } = useGetWorkersQuery({
    page: page + 1,
    limit,
    search: search || undefined
  })

  const [updateWorker, { isLoading: isSaving }] = useUpdateWorkerMutation()
  const [deleteWorker, { isLoading: isDeleting }] = useDeleteWorkerMutation()

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateWorker({ id, is_active: !currentStatus })
  }

  const handleEditOpen = (worker: Worker) => {
    const nameParts = worker.name.split(' ')
    setEditTarget(worker)
    setEditForm({
      id: worker.id,
      first_name: worker.first_name ?? nameParts[0] ?? '',
      last_name: worker.last_name ?? nameParts.slice(1).join(' '),
      email: worker.email,
      phone_number: worker.phone_number ?? worker.phone ?? '',
      workplace_id: worker.workplace_id ?? '',
      is_active: worker.is_active,
      role_id: worker.role_id ?? undefined
    })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    await updateWorker({
      ...editForm,
      phone_number: editForm.phone_number?.trim() ? editForm.phone_number.trim() : null,
      workplace_id: editForm.workplace_id?.trim() ? editForm.workplace_id.trim() : undefined
    })
    setEditForm(null)
    setEditTarget(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteWorker(deleteTarget.id)
    setDeleteTarget(null)
  }

  const filteredData =
    ownerFilter === 'owners' ? data?.data?.filter(w => w.is_author) : data?.data

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        {t('admin.workers.title')}
      </Typography>

      <Card>
        <Box sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems='center'>
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
            <ToggleButtonGroup
              size='small'
              exclusive
              value={ownerFilter}
              onChange={(_, val) => val && setOwnerFilter(val)}
            >
              <ToggleButton value='all'>{t('admin.workers.allWorkers')}</ToggleButton>
              <ToggleButton value='owners'>{t('admin.workers.ownersOnly')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.workers.name')}</TableCell>
                <TableCell>{t('admin.workers.email')}</TableCell>
                <TableCell>{t('admin.workers.phone')}</TableCell>
                <TableCell>{t('admin.workers.workplace')}</TableCell>
                <TableCell>{t('admin.workers.role')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : filteredData?.map(worker => (
                    <TableRow key={worker.id} hover>
                      <TableCell>{worker.name}</TableCell>
                      <TableCell>{worker.email}</TableCell>
                      <TableCell>{worker.phone || '-'}</TableCell>
                      <TableCell>{worker.workplace_name || worker.workplace_id}</TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={0.5}>
                          {worker.role && <Chip size='small' label={worker.role} variant='outlined' />}
                          {worker.is_author && (
                            <Chip size='small' label={t('admin.workers.author')} color='primary' />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size='small'
                          label={worker.is_active ? t('admin.workers.active') : t('admin.workers.inactive')}
                          color={worker.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Switch
                            size='small'
                            checked={worker.is_active}
                            onChange={() => handleToggleActive(worker.id, worker.is_active)}
                          />
                          <IconButton size='small' onClick={() => handleEditOpen(worker)}>
                            <RiEditLine size={18} />
                          </IconButton>
                          <IconButton size='small' color='error' onClick={() => setDeleteTarget(worker)}>
                            <RiDeleteBinLine size={18} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              {!isLoading && (!filteredData || filteredData.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
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

      <Dialog
        open={!!editForm}
        onClose={() => {
          setEditForm(null)
          setEditTarget(null)
        }}
        fullWidth
        maxWidth='sm'
      >
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
              label={t('admin.workers.email')}
              value={editForm?.email ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, email: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('admin.workers.phone')}
              value={editForm?.phone_number ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, phone_number: e.target.value } : prev))}
              fullWidth
            />
            <TextField
              label={t('admin.workers.workplace')}
              value={editForm?.workplace_id ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, workplace_id: e.target.value } : prev))}
              helperText={editTarget?.workplace_name || undefined}
              fullWidth
            />
            <TextField
              label={t('admin.workers.role')}
              type='number'
              value={editForm?.role_id ?? ''}
              onChange={e =>
                setEditForm(prev => (prev ? { ...prev, role_id: e.target.value ? Number(e.target.value) : null } : prev))
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
              <MenuItem value='active'>{t('admin.workers.active')}</MenuItem>
              <MenuItem value='inactive'>{t('admin.workers.inactive')}</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditForm(null)
              setEditTarget(null)
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button variant='contained' onClick={handleEditSave} disabled={isSaving}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>{t('admin.workers.deleteConfirm')}</DialogContent>
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
