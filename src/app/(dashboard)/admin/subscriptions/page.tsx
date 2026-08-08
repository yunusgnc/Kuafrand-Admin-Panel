'use client'

import { useState } from 'react'

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Alert,
  Typography
} from '@mui/material'
import { RiEditLine, RiHandCoinLine } from 'react-icons/ri'

import AdminTablePage from '@/components/admin/AdminTablePage'
import type { Subscription, UpdateSubscriptionRequest } from '@/types/admin'
import {
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useGrantManualSubscriptionMutation
} from '@/store/api/adminApi'

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'

  try {
    const d = new Date(dateStr)

    
return d.toLocaleDateString('tr-TR')
  } catch {
    return dateStr
  }
}

const STATUS_COLORS: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  active: 'success',
  expired: 'error',
  canceled: 'error',
  revoked: 'error',
  trialing: 'warning'
}

export default function SubscriptionsPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [editForm, setEditForm] = useState<UpdateSubscriptionRequest | null>(null)

  const [manualForm, setManualForm] = useState<{
    workplaceId: string
    name: string
    date: string
    note: string
  } | null>(null)

  const [manualError, setManualError] = useState<string | null>(null)

  const { data, isLoading } = useGetSubscriptionsQuery({
    page: page + 1,
    limit,
    search: search || undefined,
    status: statusFilter || undefined
  })

  const [updateSubscription, { isLoading: isSaving }] = useUpdateSubscriptionMutation()
  const [grantManualSubscription, { isLoading: isGranting }] = useGrantManualSubscriptionMutation()

  // ── Elden ödendi ──────────────────────────────────────────────────────────
  // Bu satırın durumunu elle "Aktif" yapmak kalıcı değil: mağaza satırıysa
  // App Store / Play Store bildirimi onu tekrar 'expired' yapıp işletmeyi
  // kapatabiliyor. Elden ödemede mağazadan bağımsız ayrı bir kayıt yazılır ve
  // işletme + sahip yetkisi birlikte aktifleştirilir.
  const openManual = (row: Subscription) => {
    if (!row.workplace_id) return

    const oneMonthLater = new Date()

    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

    setManualForm({
      workplaceId: row.workplace_id,
      name: row.workplace_title || row.workplace_id,
      date: oneMonthLater.toISOString().slice(0, 10),
      note: ''
    })
    setManualError(null)
  }

  const handleManualSave = async () => {
    if (!manualForm) return

    try {
      await grantManualSubscription({
        id: manualForm.workplaceId,
        expires_at: `${manualForm.date}T23:59:59Z`,
        note: manualForm.note.trim() || undefined
      }).unwrap()
      setManualForm(null)
    } catch (err) {
      setManualError(
        (err as { data?: { error?: string } })?.data?.error ?? 'Abonelik tanımlanamadı.'
      )
    }
  }

  const handleSave = async () => {
    if (!editForm) return
    await updateSubscription({
      ...editForm,
      expires_at: editForm.expires_at || undefined,
      status: editForm.status || undefined,
      product_id: editForm.product_id || undefined
    })
    setEditForm(null)
  }

  return (
    <>
      <AdminTablePage<Subscription>
        title='Abonelikler'
        idPrefix='subscriptions'
        rows={data?.data}
        total={data?.total ?? 0}
        page={page}
        rowsPerPage={limit}
        isLoading={isLoading}
        search={search}
        onSearchChange={v => {
          setSearch(v)
          setPage(0)
        }}
        onPageChange={setPage}
        onRowsPerPageChange={v => {
          setLimit(v)
          setPage(0)
        }}
        searchPlaceholder='İşyeri ara...'
        columns={[
          {
            header: 'İşyeri',
            render: row => (
              <Stack>
                <Typography component='span' variant='body2' fontWeight={500}>
                  {row.workplace_title || row.workplace_id || '-'}
                </Typography>
              </Stack>
            )
          },
          {
            header: 'Durum',
            render: row => (
              <Chip
                size='small'
                color={STATUS_COLORS[(row.status as string) || ''] || 'default'}
                label={(row.status as string) || '-'}
              />
            )
          },
          {
            header: 'Bitiş Tarihi',
            render: row => formatDate(row.expires_at)
          },
          {
            header: 'Ürün',
            render: row => (
              <Typography variant='body2' color='text.secondary'>
                {row.product_id || '-'}
              </Typography>
            )
          }
        ]}
        actions={row => (
          <Stack direction='row' spacing={0.5}>
            <Tooltip title='Düzenle'>
              <IconButton
                size='small'
                onClick={() =>
                  setEditForm({
                    id: row.id,
                    status: row.status as string,
                    expires_at: row.expires_at as string,
                    product_id: row.product_id as string
                  })
                }
              >
                <RiEditLine size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Elden ödendi — kalıcı olarak aktifleştir'>
              {/* disabled IconButton tooltip'i yutar; span sarmalayıcı gerekli */}
              <span>
                <IconButton
                  size='small'
                  color='success'
                  disabled={!row.workplace_id}
                  onClick={() => openManual(row)}
                >
                  <RiHandCoinLine size={18} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )}
        toolbar={
          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Durum</InputLabel>
            <Select
              value={statusFilter}
              label='Durum'
              onChange={e => {
                setStatusFilter(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value=''>Tümü</MenuItem>
              <MenuItem value='active'>Aktif</MenuItem>
              <MenuItem value='expired'>Süresi Dolmuş</MenuItem>
              <MenuItem value='canceled'>İptal</MenuItem>
              <MenuItem value='revoked'>İptal Edilmiş</MenuItem>
              <MenuItem value='trialing'>Deneme</MenuItem>
            </Select>
          </FormControl>
        }
      />

      <Dialog open={!!editForm} onClose={() => setEditForm(null)} fullWidth maxWidth='sm'>
        <DialogTitle>Abonelik Düzenle (Manuel Override)</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <FormControl fullWidth size='small'>
              <InputLabel>Durum</InputLabel>
              <Select
                value={editForm?.status ?? ''}
                label='Durum'
                onChange={e => setEditForm(prev => (prev ? { ...prev, status: e.target.value } : prev))}
              >
                <MenuItem value='active'>Aktif</MenuItem>
                <MenuItem value='expired'>Süresi Dolmuş</MenuItem>
                <MenuItem value='canceled'>İptal</MenuItem>
                <MenuItem value='revoked'>İptal Edilmiş</MenuItem>
                <MenuItem value='trialing'>Deneme</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Bitiş Tarihi'
              type='date'
              value={editForm?.expires_at?.slice(0, 10) ?? ''}
              onChange={e =>
                setEditForm(prev =>
                  prev ? { ...prev, expires_at: e.target.value ? `${e.target.value}T23:59:59Z` : undefined } : prev
                )
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label='Ürün ID'
              value={editForm?.product_id ?? ''}
              onChange={e => setEditForm(prev => (prev ? { ...prev, product_id: e.target.value } : prev))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditForm(null)}>İptal</Button>
          <Button variant='contained' onClick={handleSave} disabled={isSaving}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Elden ödendi */}
      <Dialog open={Boolean(manualForm)} onClose={() => setManualForm(null)} fullWidth maxWidth='xs'>
        <DialogTitle>Elden Ödendi</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity='success'>
              <strong>{manualForm?.name}</strong> seçilen tarihe kadar tamamen aktifleşir:
              abonelik, işletme ve mekan sahibinin yetkisi birlikte açılır.
              <br />
              Mağaza kaydına dokunulmaz; App Store / Play Store bildirimleri bu kaydı silemez.
              Tarih geçince erişim kendiliğinden kapanır.
            </Alert>

            {manualError && <Alert severity='error'>{manualError}</Alert>}

            <TextField
              label='Erişim bitiş tarihi'
              type='date'
              value={manualForm?.date ?? ''}
              onChange={e => setManualForm(prev => (prev ? { ...prev, date: e.target.value } : prev))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label='Not (opsiyonel)'
              placeholder='ör. 1 aylık nakit tahsilat'
              value={manualForm?.note ?? ''}
              onChange={e => setManualForm(prev => (prev ? { ...prev, note: e.target.value } : prev))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualForm(null)}>İptal</Button>
          <Button
            variant='contained'
            color='success'
            onClick={handleManualSave}
            disabled={isGranting || !manualForm?.date}
          >
            Aktifleştir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
