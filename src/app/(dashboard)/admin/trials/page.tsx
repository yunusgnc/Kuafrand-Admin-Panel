'use client'

import { useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { RiGiftLine } from 'react-icons/ri'

import type { TrialProvisionRequest, TrialProvisionResponse } from '@/types/admin'
import {
  useGetCitiesQuery,
  useGetDistrictsByCityQuery,
  useGetIndustriesQuery,
  useProvisionTrialMutation
} from '@/store/api/adminApi'

const defaultForm: Partial<TrialProvisionRequest> = {
  trial_days: 14,
  product_id: 'trial.manual',
  platform: 'ios',
  workplace_gender_type: 'unisex'
}

function formatTrialEndsAt(iso?: string) {
  if (!iso) return '-'

  try {
    return new Date(iso).toLocaleString('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  } catch {
    return iso
  }
}

export default function TrialProvisionPage() {
  const [form, setForm] = useState<Partial<TrialProvisionRequest>>(defaultForm)
  const [result, setResult] = useState<TrialProvisionResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: industriesData } = useGetIndustriesQuery({ limit: 200 })
  const industries = industriesData?.data ?? []

  const { data: cities = [] } = useGetCitiesQuery()
  const cityId = form.workplace_city_id ? Number(form.workplace_city_id) : 0
  const { data: districts = [] } = useGetDistrictsByCityQuery(cityId, { skip: !cityId })

  const [provisionTrial, { isLoading: isSubmitting }] = useProvisionTrialMutation()

  const update = (key: keyof TrialProvisionRequest, value: string | number | undefined) => {
    setResult(null)
    setErrorMessage(null)

    if (key === 'workplace_city_id') {
      const num = value === undefined ? undefined : Number(value)

      setForm(prev => ({ ...prev, workplace_city_id: num, workplace_district_id: undefined }))
    } else {
      setForm(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setResult(null)

    const owner_first_name = String(form.owner_first_name ?? '').trim()
    const owner_last_name = String(form.owner_last_name ?? '').trim()
    const owner_username = String(form.owner_username ?? '').trim()
    const owner_password = String(form.owner_password ?? '').trim()
    const workplace_title = String(form.workplace_title ?? '').trim()
    const workplace_city_id = Number(form.workplace_city_id)
    const workplace_district_id = Number(form.workplace_district_id)

    if (!owner_first_name || !owner_last_name || !owner_username || !owner_password) {
      setErrorMessage('Sahip adı, soyadı, kullanıcı adı ve şifre zorunludur.')

      return
    }

    if (!workplace_title || !Number.isInteger(workplace_city_id) || workplace_city_id <= 0) {
      setErrorMessage('İşyeri adı ve geçerli il ID zorunludur.')

      return
    }

    if (!Number.isInteger(workplace_district_id) || workplace_district_id <= 0) {
      setErrorMessage('Geçerli ilçe ID zorunludur.')

      return
    }

    const payload: TrialProvisionRequest = {
      owner_first_name,
      owner_last_name,
      owner_username,
      owner_password,
      workplace_title,
      workplace_city_id,
      workplace_district_id,
      owner_phone_number: form.owner_phone_number?.trim() || undefined,
      owner_email: form.owner_email?.trim() || undefined,
      workplace_address: form.workplace_address?.trim() || undefined,
      workplace_gender_type: form.workplace_gender_type,
      workplace_phone: form.workplace_phone?.trim() || undefined,
      workplace_email: form.workplace_email?.trim() || undefined,
      workplace_website: form.workplace_website?.trim() || undefined,
      workplace_industry_type_id: form.workplace_industry_type_id,
      workplace_company_type: form.workplace_company_type?.trim() || undefined,
      trial_days: form.trial_days ?? 14,
      trial_expires_at: form.trial_expires_at || undefined,
      product_id: form.product_id || 'trial.manual',
      platform: form.platform || 'ios'
    }

    try {
      const res = await provisionTrial(payload).unwrap()

      setResult(res)
      setForm(defaultForm)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err && err.data && typeof (err.data as { error?: string }).error === 'string'
          ? (err.data as { error: string }).error
          : 'Deneme hesabı oluşturulurken bir hata oluştu.'

      setErrorMessage(msg)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction='row' alignItems='center' gap={1} sx={{ mb: 3 }}>
        <RiGiftLine size={28} />
        <Typography variant='h4' fontWeight={600}>
          Deneme Hesabı Aç
        </Typography>
      </Stack>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
        Sahip + işyeri + aktif deneme aboneliği tek seferde oluşturulur. Önce il seçin, ardından ilçe
        listesi yüklenecektir.
      </Typography>

      {errorMessage && (
        <Alert severity='error' onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {result && (
        <Alert severity='success' sx={{ mb: 2 }}>
          {result.message}
          <Typography variant='body2' sx={{ mt: 1 }}>
            Deneme bitiş: <strong>{formatTrialEndsAt(result.trial_ends_at)}</strong>
          </Typography>
          <Typography variant='caption' display='block' sx={{ mt: 0.5 }}>
            İşyeri ID: {String((result.workplace as { id?: string }).id ?? '-')} · Abonelik ID:{' '}
            {String((result.subscription as { id?: string }).id ?? '-')}
          </Typography>
        </Alert>
      )}

      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2 }}>
            Sahip (owner) bilgileri
          </Typography>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label='Ad'
                value={form.owner_first_name ?? ''}
                onChange={e => update('owner_first_name', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label='Soyad'
                value={form.owner_last_name ?? ''}
                onChange={e => update('owner_last_name', e.target.value)}
                fullWidth
                required
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label='Kullanıcı adı'
                value={form.owner_username ?? ''}
                onChange={e => update('owner_username', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label='Şifre'
                type='password'
                value={form.owner_password ?? ''}
                onChange={e => update('owner_password', e.target.value)}
                fullWidth
                required
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label='Telefon'
                placeholder='+905551112233'
                value={form.owner_phone_number ?? ''}
                onChange={e => update('owner_phone_number', e.target.value)}
                fullWidth
                helperText='+90 ile başlamalı, 10 rakam'
              />
              <TextField
                label='E-posta'
                type='email'
                value={form.owner_email ?? ''}
                onChange={e => update('owner_email', e.target.value)}
                fullWidth
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2 }}>
            İşyeri bilgileri
          </Typography>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <TextField
              label='İşyeri adı'
              value={form.workplace_title ?? ''}
              onChange={e => update('workplace_title', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label='Adres'
              value={form.workplace_address ?? ''}
              onChange={e => update('workplace_address', e.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth size='small' required>
                <InputLabel>İl</InputLabel>
                <Select
                  value={form.workplace_city_id ?? ''}
                  label='İl'
                  onChange={e =>
                    update('workplace_city_id', e.target.value ? Number(e.target.value) : undefined)
                  }
                >
                  <MenuItem value=''>Seçiniz</MenuItem>
                  {cities.map(city => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size='small' required disabled={!form.workplace_city_id}>
                <InputLabel>İlçe</InputLabel>
                <Select
                  value={form.workplace_district_id ?? ''}
                  label='İlçe'
                  onChange={e =>
                    update('workplace_district_id', e.target.value ? Number(e.target.value) : undefined)
                  }
                >
                  <MenuItem value=''>Seçiniz</MenuItem>
                  {districts.map(dist => (
                    <MenuItem key={dist.id} value={dist.id}>
                      {dist.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <FormControl fullWidth size='small'>
              <InputLabel>Cinsiyet tipi</InputLabel>
              <Select
                value={form.workplace_gender_type ?? 'unisex'}
                label='Cinsiyet tipi'
                onChange={e => update('workplace_gender_type', e.target.value as TrialProvisionRequest['workplace_gender_type'])}
              >
                <MenuItem value='male'>Erkek</MenuItem>
                <MenuItem value='female'>Kadın</MenuItem>
                <MenuItem value='unisex'>Unisex</MenuItem>
                <MenuItem value='mixed'>Karma</MenuItem>
              </Select>
            </FormControl>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label='İşyeri telefon'
                value={form.workplace_phone ?? ''}
                onChange={e => update('workplace_phone', e.target.value)}
                fullWidth
              />
              <TextField
                label='İşyeri e-posta'
                type='email'
                value={form.workplace_email ?? ''}
                onChange={e => update('workplace_email', e.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label='Web sitesi'
              value={form.workplace_website ?? ''}
              onChange={e => update('workplace_website', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth size='small'>
              <InputLabel>Sektör</InputLabel>
              <Select
                value={form.workplace_industry_type_id ?? ''}
                label='Sektör'
                onChange={e =>
                  update('workplace_industry_type_id', e.target.value ? Number(e.target.value) : undefined)
                }
              >
                <MenuItem value=''>Seçiniz</MenuItem>
                {industries.map(ind => (
                  <MenuItem key={ind.id} value={Number(ind.id) || ind.id}>
                    {(ind as { type?: string }).type ?? String(ind.id)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2 }}>
            Deneme ayarları
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              label='Deneme süresi (gün)'
              type='number'
              inputProps={{ min: 1, max: 365 }}
              value={form.trial_days ?? 14}
              onChange={e => update('trial_days', e.target.value ? Number(e.target.value) : undefined)}
              sx={{ maxWidth: 160 }}
            />
            <FormControl size='small' sx={{ minWidth: 120 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={form.platform ?? 'ios'}
                label='Platform'
                onChange={e => update('platform', e.target.value as 'ios' | 'android')}
              >
                <MenuItem value='ios'>iOS</MenuItem>
                <MenuItem value='android'>Android</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Ürün ID'
              value={form.product_id ?? 'trial.manual'}
              onChange={e => update('product_id', e.target.value)}
              sx={{ flex: 1 }}
            />
          </Stack>

          <Button type='submit' variant='contained' disabled={isSubmitting} size='large'>
            {isSubmitting ? 'Oluşturuluyor...' : 'Deneme hesabı oluştur'}
          </Button>
        </form>
      </Card>
    </Box>
  )
}
