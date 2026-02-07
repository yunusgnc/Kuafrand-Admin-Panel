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
  Stack
} from '@mui/material'
import { RiArrowDownSLine } from 'react-icons/ri'
import { useI18n } from '@/hooks/useI18n'
import {
  useGetRolesQuery,
  useGetRoleDetailQuery,
  useGetPermissionsQuery,
  useUpdateRolePermissionsMutation
} from '@/store/api/adminApi'

export default function RolesPage() {
  const { t } = useI18n()
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)

  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery()
  const { data: allPermissions, isLoading: permsLoading } = useGetPermissionsQuery()
  const { data: roleDetail, isFetching: detailFetching } = useGetRoleDetailQuery(selectedRoleId!, {
    skip: !selectedRoleId
  })
  const [updateRolePermissions, { isLoading: isSaving }] = useUpdateRolePermissionsMutation()

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId)
    setDirty(false)
  }

  const handlePermissionToggle = (permName: string) => {
    if (!dirty && roleDetail) {
      setSelectedPermissions(roleDetail.permissions.map(p => p.name))
      setDirty(true)
    }

    setSelectedPermissions(prev => {
      setDirty(true)
      return prev.includes(permName) ? prev.filter(p => p !== permName) : [...prev, permName]
    })
  }

  const handleSave = async () => {
    if (!selectedRoleId) return
    await updateRolePermissions({ roleId: selectedRoleId, permission_names: selectedPermissions })
    setDirty(false)
  }

  const currentPermissions = dirty
    ? selectedPermissions
    : roleDetail?.permissions.map(p => p.name) ?? []

  const permissionGroups = allPermissions?.reduce(
    (acc, perm) => {
      const group = perm.group || 'other'
      if (!acc[group]) acc[group] = []
      acc[group].push(perm)
      return acc
    },
    {} as Record<string, typeof allPermissions>
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
              <Typography variant='h6' sx={{ mb: 2 }}>
                {t('admin.roles.roleName')}
              </Typography>
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
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                          {role.name}
                        </Typography>
                        {role.description && (
                          <Typography variant='body2' sx={{ opacity: 0.8 }}>
                            {role.description}
                          </Typography>
                        )}
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
                  <Button variant='contained' size='small' onClick={handleSave} disabled={isSaving}>
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
                                  <Chip size='small' label={perm.name} variant='outlined' />
                                </TableCell>
                                <TableCell>
                                  <Typography variant='body2' color='text.secondary'>
                                    {perm.description || '-'}
                                  </Typography>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
