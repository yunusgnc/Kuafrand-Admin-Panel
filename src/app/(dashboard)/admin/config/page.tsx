'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Skeleton
} from '@mui/material'
import { RiEditLine } from 'react-icons/ri'
import type { ConfigItem, ConfigValue } from '@/types/admin'
import { useGetConfigQuery, useUpdateConfigMutation } from '@/store/api/adminApi'

function formatValue(val: ConfigValue): string {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'boolean') return val ? 'Evet' : 'Hayır'
  return String(val)
}

function parseValue(str: string, current?: ConfigValue): ConfigValue {
  if (str === '' || str === 'null') return null
  const lower = str.toLowerCase()
  if (lower === 'true' || lower === 'false') return lower === 'true'
  const n = Number(str)
  if (Number.isFinite(n)) return n
  return str
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('tr-TR')
  } catch {
    return dateStr
  }
}

function isBooleanLike(val: ConfigValue): boolean {
  if (typeof val === 'boolean') return true
  const s = String(val ?? '').toLowerCase()
  return s === 'true' || s === 'false' || s === '1' || s === '0'
}

export default function ConfigPage() {
  const [editItem, setEditItem] = useState<ConfigItem | null>(null)
  const [editValue, setEditValue] = useState('')

  const { data: configs, isLoading } = useGetConfigQuery()
  const [updateConfig, { isLoading: isSaving }] = useUpdateConfigMutation()

  const handleOpenEdit = (item: ConfigItem) => {
    setEditItem(item)
    setEditValue(String(item.value ?? ''))
  }

  const handleSave = async () => {
    if (!editItem) return
    const value = parseValue(editValue, editItem.value)
    await updateConfig({ key: editItem.key, value })
    setEditItem(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        Konfigürasyon / Feature Flags
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Anahtar</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell>Değer</TableCell>
                <TableCell>Son Güncelleme</TableCell>
                <TableCell align='right'>İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton width={180} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={200} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={120} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={40} />
                      </TableCell>
                    </TableRow>
                  ))
                : configs?.map(item => (
                    <TableRow key={item.id ?? item.key} hover>
                      <TableCell>
                        <Typography variant='body2' fontWeight={500}>
                          {item.key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' color='text.secondary'>
                          {item.description ?? '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size='small'
                          label={formatValue(item.value)}
                          color={
                            isBooleanLike(item.value) && String(item.value).toLowerCase() === 'true'
                              ? 'success'
                              : isBooleanLike(item.value) && String(item.value).toLowerCase() === 'false'
                                ? 'default'
                                : 'default'
                          }
                          variant={isBooleanLike(item.value) ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant='caption' color='text.secondary'>
                          {formatDate(item.updated_at)}
                        </Typography>
                        {item.updated_by_name && (
                          <Typography variant='caption' display='block' color='text.secondary'>
                            {item.updated_by_name} {item.updated_by_last_name ?? ''}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' onClick={() => handleOpenEdit(item)}>
                          <RiEditLine size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              {!isLoading && (!configs || configs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Konfigürasyon bulunamadı</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={!!editItem} onClose={() => setEditItem(null)} fullWidth maxWidth='xs'>
        <DialogTitle>Değer Güncelle</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Typography variant='body2' fontWeight={500}>
              {editItem?.key}
            </Typography>
            {editItem?.description && (
              <Typography variant='caption' color='text.secondary'>
                {editItem.description}
              </Typography>
            )}
            <TextField
              label='Değer'
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              fullWidth
              placeholder={
                isBooleanLike(editItem?.value) ? 'true veya false' : 'Değer girin'
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>İptal</Button>
          <Button variant='contained' onClick={handleSave} disabled={isSaving}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
