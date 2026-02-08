'use client'

import { useState } from 'react'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Checkbox,
  Button,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Switch
} from '@mui/material'
import { RiArrowDownSLine, RiAddLine, RiEditLine } from 'react-icons/ri'

import { useI18n } from '@/hooks/useI18n'
import {
  useGetRolesQuery,
  useGetRoleDetailQuery,
  useGetPermissionsQuery,
  useUpdateRolePermissionsMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useCreatePermissionMutation,
  useUpdatePermissionMutation
} from '@/store/api/adminApi'
import type {
  Role,
  Permission,
  CreateRoleRequest,
  CreatePermissionRequest
} from '@/types/admin'

export default function RolesPage() {
  const { t } = useI18n()
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)

  const [createRoleOpen, setCreateRoleOpen] = useState(false)
  const [editRole, setEditRole] = useState<Role | null>(null)

  const [createForm, setCreateForm] = useState<CreateRoleRequest>({
    display_name: '',
    description: '',
    is_active: true
  })

  const [createPermOpen, setCreatePermOpen] = useState(false)
  const [editPerm, setEditPerm] = useState<Permission | null>(null)

  const [createPermForm, setCreatePermForm] = useState<CreatePermissionRequest>({
    name: '',
    display_name: '',
    description: '',
    category: '',
    is_active: true
  })

  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery()
  const { data: allPermissions, isLoading: permsLoading } = useGetPermissionsQuery()

  const { data: roleDetail, isFetching: detailFetching } = useGetRoleDetailQuery(selectedRoleId!, {
    skip: !selectedRoleId
  })

  const [updateRolePermissions, { isLoading: isSaving }] = useUpdateRolePermissionsMutation()
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation()
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation()
  const [createPermission, { isLoading: isCreatingPerm }] = useCreatePermissionMutation()
  const [updatePermission, { isLoading: isUpdatingPerm }] = useUpdatePermissionMutation()

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId)
    setDirty(false)
  }

  const handlePermissionToggle = (permName: string) => {
    if (!dirty && roleDetail) {
      setSelectedPermissions(roleDetail.permissions.map(p => p.name))
      setDirty(true)
    }

    setSelectedPermissions(prev =>
      prev.includes(permName) ? prev.filter(p => p !== permName) : [...prev, permName]
    )
    setDirty(true)
  }

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return
    await updateRolePermissions({ roleId: selectedRoleId, permission_names: selectedPermissions })
    setDirty(false)
  }

  const handleCreateRole = async () => {
    if (!createForm.display_name.trim()) return
    await createRole({
      display_name: createForm.display_name.trim(),
      description: createForm.description?.trim() || undefined,
      is_active: createForm.is_active
    })
    setCreateRoleOpen(false)
    setCreateForm({ display_name: '', description: '', is_active: true })
  }

  const handleUpdateRole = async () => {
    if (!editRole) return
    await updateRole({
      roleId: editRole.id,
      display_name: editRole.display_name?.trim(),
      description: editRole.description?.trim(),
      is_active: editRole.is_active
    })
    setEditRole(null)
  }

  const handleCreatePermission = async () => {
    if (!createPermForm.name.trim() || !createPermForm.display_name.trim()) return
    await createPermission({
      name: createPermForm.name.trim(),
      display_name: createPermForm.display_name.trim(),
      description: createPermForm.description?.trim() || undefined,
      category: createPermForm.category?.trim() || undefined,
      is_active: createPermForm.is_active
    })
    setCreatePermOpen(false)
    setCreatePermForm({ name: '', display_name: '', description: '', category: '', is_active: true })
  }

  const handleUpdatePermission = async () => {
    if (!editPerm) return
    await updatePermission({
      id: editPerm.id,
      display_name: editPerm.display_name?.trim(),
      description: editPerm.description?.trim(),
      category: editPerm.category?.trim(),
      is_active: editPerm.is_active
    })
    setEditPerm(null)
  }

  const currentPermissions = dirty
    ? selectedPermissions
    : roleDetail?.permissions.map(p => p.name) ?? []

  const permissionGroups = allPermissions?.reduce(
    (acc, perm) => {
      const group = perm.group || perm.category || 'other'

      if (!acc[group]) acc[group] = []
      acc[group].push(perm)
      
return acc
    },
    {} as Record<string, Permission[]>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        {t('admin.roles.title')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
                <Typography variant='h6'>{t('admin.roles.roleName')}</Typography>
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<RiAddLine />}
                  onClick={() => setCreateRoleOpen(true)}
                >
                  Yeni Rol
                </Button>
              </Stack>
              {rolesLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 1 }} />)
              ) : (
                <Stack spacing={1}>
                  {roles?.map(role => (
                    <Card
                      key={role.id}
                      variant={selectedRoleId === role.id ? 'elevation' : 'outlined'}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedRoleId === role.id ? 'primary.main' : 'transparent',
                        color: selectedRoleId === role.id ? 'primary.contrastText' : 'text.primary',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                            {role.display_name || role.name}
                          </Typography>
                          {role.description && (
                            <Typography variant='body2' sx={{ opacity: 0.8 }}>
                              {role.description}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          size='small'
                          onClick={e => {
                            e.stopPropagation()
                            setEditRole({ ...role })
                          }}
                          sx={{ color: 'inherit' }}
                        >
                          <RiEditLine size={18} />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
                <Typography variant='h6'>{t('admin.roles.permissions')}</Typography>
                {selectedRoleId && dirty && (
                  <Button variant='contained' size='small' onClick={handleSavePermissions} disabled={isSaving}>
                    {t('common.save')}
                  </Button>
                )}
              </Stack>

              {!selectedRoleId ? (
                <Typography color='text.secondary' sx={{ py: 4, textAlign: 'center' }}>
                  {t('admin.roles.roleName')}
                </Typography>
              ) : detailFetching || permsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 1 }} />)
              ) : permissionGroups ? (
                Object.entries(permissionGroups).map(([group, perms]) => (
                  <Accordion key={group} defaultExpanded>
                    <AccordionSummary expandIcon={<RiArrowDownSLine />}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <Typography sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{group}</Typography>
                        <Chip
                          size='small'
                          label={`${perms.filter(p => currentPermissions.includes(p.name)).length}/${perms.length}`}
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <TableContainer>
                        <Table size='small'>
                          <TableHead>
                            <TableRow>
                              <TableCell padding='checkbox' />
                              <TableCell>{t('admin.roles.permissions')}</TableCell>
                              <TableCell>Açıklama</TableCell>
                              <TableCell align='right'>İşlem</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {perms.map(perm => (
                              <TableRow key={perm.id} hover>
                                <TableCell padding='checkbox'>
                                  <Checkbox
                                    size='small'
                                    checked={currentPermissions.includes(perm.name)}
                                    onChange={() => handlePermissionToggle(perm.name)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip size='small' label={perm.display_name || perm.name} variant='outlined' />
                                </TableCell>
                                <TableCell>
                                  <Typography variant='body2' color='text.secondary'>
                                    {perm.description || '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell align='right'>
                                  <IconButton size='small' onClick={() => setEditPerm({ ...perm })}>
                                    <RiEditLine size={18} />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography color='text.secondary' sx={{ py: 4, textAlign: 'center' }}>
                  {t('admin.noData')}
                </Typography>
              )}

              <Button
                size='small'
                variant='outlined'
                startIcon={<RiAddLine />}
                onClick={() => setCreatePermOpen(true)}
                sx={{ mt: 2 }}
              >
                Yeni İzin
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Role Dialog */}
      <Dialog open={createRoleOpen} onClose={() => setCreateRoleOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Yeni Rol</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Rol Adı'
              value={createForm.display_name}
              onChange={e => setCreateForm(prev => ({ ...prev, display_name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label='Açıklama'
              value={createForm.description}
              onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />
            <Stack direction='row' alignItems='center' spacing={2}>
              <Typography variant='body2'>Aktif</Typography>
              <Switch
                checked={createForm.is_active}
                onChange={e => setCreateForm(prev => ({ ...prev, is_active: e.target.checked }))}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateRoleOpen(false)}>İptal</Button>
          <Button variant='contained' onClick={handleCreateRole} disabled={isCreatingRole || !createForm.display_name.trim()}>
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editRole} onClose={() => setEditRole(null)} fullWidth maxWidth='sm'>
        <DialogTitle>Rol Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editRole && (
            <Stack spacing={2}>
              <TextField
                label='Rol Adı'
                value={editRole.display_name || editRole.name}
                onChange={e => setEditRole(prev => (prev ? { ...prev, display_name: e.target.value } : prev))}
                fullWidth
              />
              <TextField
                label='Açıklama'
                value={editRole.description || ''}
                onChange={e => setEditRole(prev => (prev ? { ...prev, description: e.target.value } : prev))}
                fullWidth
                multiline
                rows={2}
              />
              <Stack direction='row' alignItems='center' spacing={2}>
                <Typography variant='body2'>Aktif</Typography>
                <Switch
                  checked={editRole.is_active ?? true}
                  onChange={e => setEditRole(prev => (prev ? { ...prev, is_active: e.target.checked } : prev))}
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRole(null)}>İptal</Button>
          <Button variant='contained' onClick={handleUpdateRole} disabled={isUpdatingRole}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Permission Dialog */}
      <Dialog open={createPermOpen} onClose={() => setCreatePermOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Yeni İzin</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='İzin Adı (teknik)'
              placeholder='örn: users.read'
              value={createPermForm.name}
              onChange={e => setCreatePermForm(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              helperText='Küçük harf, nokta ile ayrılmış'
            />
            <TextField
              label='Görünen Ad'
              value={createPermForm.display_name}
              onChange={e => setCreatePermForm(prev => ({ ...prev, display_name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label='Açıklama'
              value={createPermForm.description}
              onChange={e => setCreatePermForm(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Kategori / Grup'
              value={createPermForm.category}
              onChange={e => setCreatePermForm(prev => ({ ...prev, category: e.target.value }))}
              fullWidth
            />
            <Stack direction='row' alignItems='center' spacing={2}>
              <Typography variant='body2'>Aktif</Typography>
              <Switch
                checked={createPermForm.is_active}
                onChange={e => setCreatePermForm(prev => ({ ...prev, is_active: e.target.checked }))}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatePermOpen(false)}>İptal</Button>
          <Button
            variant='contained'
            onClick={handleCreatePermission}
            disabled={isCreatingPerm || !createPermForm.name.trim() || !createPermForm.display_name.trim()}
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={!!editPerm} onClose={() => setEditPerm(null)} fullWidth maxWidth='sm'>
        <DialogTitle>İzin Düzenle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editPerm && (
            <Stack spacing={2}>
              <TextField label='İzin Adı' value={editPerm.name} fullWidth disabled />
              <TextField
                label='Görünen Ad'
                value={editPerm.display_name || editPerm.name}
                onChange={e => setEditPerm(prev => (prev ? { ...prev, display_name: e.target.value } : prev))}
                fullWidth
              />
              <TextField
                label='Açıklama'
                value={editPerm.description || ''}
                onChange={e => setEditPerm(prev => (prev ? { ...prev, description: e.target.value } : prev))}
                fullWidth
              />
              <TextField
                label='Kategori'
                value={editPerm.category || ''}
                onChange={e => setEditPerm(prev => (prev ? { ...prev, category: e.target.value } : prev))}
                fullWidth
              />
              <Stack direction='row' alignItems='center' spacing={2}>
                <Typography variant='body2'>Aktif</Typography>
                <Switch
                  checked={editPerm.is_active ?? true}
                  onChange={e => setEditPerm(prev => (prev ? { ...prev, is_active: e.target.checked } : prev))}
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPerm(null)}>İptal</Button>
          <Button variant='contained' onClick={handleUpdatePermission} disabled={isUpdatingPerm}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
