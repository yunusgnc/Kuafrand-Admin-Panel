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
  TextField
} from '@mui/material'
import { RiAddLine, RiDeleteBinLine } from 'react-icons/ri'

import AdminTablePage from '@/components/admin/AdminTablePage'
import type { IndustryService, CreateIndustryServiceRequest, Industry, Service } from '@/types/admin'
import {
  useGetIndustryServicesQuery,
  useGetIndustriesQuery,
  useCreateIndustryServiceMutation,
  useDeleteIndustryServiceMutation,
  useGetServicesQuery
} from '@/store/api/adminApi'

export default function AdminIndustryServicesPage() {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [industryId, setIndustryId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateIndustryServiceRequest>({ industry_id: '', service_id: '' })
  const [deleteTarget, setDeleteTarget] = useState<IndustryService | null>(null)

  const { data: industriesData, isLoading: isIndustriesLoading } = useGetIndustriesQuery({
    page: 1,
    limit: 200
  })

  const { data: servicesData, isLoading: isServicesLoading } = useGetServicesQuery({
    page: 1,
    limit: 200
  })

  const normalizedIndustryId = industryId.trim()
  const normalizedServiceId = serviceId.trim()
  const isValidIndustryId = normalizedIndustryId.length === 0 || /^\d+$/.test(normalizedIndustryId)
  const isValidServiceId = normalizedServiceId.length === 0 || /^\d+$/.test(normalizedServiceId)

  const { data, isLoading } = useGetIndustryServicesQuery(
    {
      page: page + 1,
      limit,
      search: search || undefined,
      industry_id: normalizedIndustryId || undefined,
      service_id: normalizedServiceId || undefined
    },
    { skip: !isValidIndustryId || !isValidServiceId }
  )

  const [createIndustryService, { isLoading: isCreating }] = useCreateIndustryServiceMutation()
  const [deleteIndustryService, { isLoading: isDeleting }] = useDeleteIndustryServiceMutation()

  const handleCreate = async () => {
    const industryValue = String(createForm.industry_id ?? '').trim()
    const serviceValue = String(createForm.service_id ?? '').trim()

    if (!/^\d+$/.test(industryValue) || !/^\d+$/.test(serviceValue)) return

    await createIndustryService({
      industry_id: Number(industryValue),
      service_id: Number(serviceValue)
    })
    setCreateOpen(false)
    setCreateForm({ industry_id: '', service_id: '' })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const industryValue = deleteTarget.industry_id ?? normalizedIndustryId
    const serviceValue = deleteTarget.service_id ?? deleteTarget.id
    const industryIdValue = String(industryValue ?? '').trim()
    const serviceIdValue = String(serviceValue ?? '').trim()

    if (!/^\d+$/.test(industryIdValue) || !/^\d+$/.test(serviceIdValue)) return

    await deleteIndustryService({ industry_id: industryIdValue, service_id: serviceIdValue })
    setDeleteTarget(null)
  }

  const industries = (industriesData?.data ?? []) as Industry[]
  const services = (servicesData?.data ?? []) as Service[]

  return (
    <>
      <AdminTablePage<IndustryService>
        title='Sektör - Hizmet'
        idPrefix='industry-services'
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label='Sektör'
              value={industryId}
              onChange={e => {
                setIndustryId(e.target.value)
                setPage(0)
              }}
              size='small'
              error={!!normalizedIndustryId && !isValidIndustryId}
              helperText={normalizedIndustryId && !isValidIndustryId ? 'Geçerli bir sektör ID girin' : ' '}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value=''>Tümü</MenuItem>
              {industries.map(industry => (
                <MenuItem key={industry.id} value={String(industry.id)}>
                  {industry.type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label='Hizmet'
              value={serviceId}
              onChange={e => {
                setServiceId(e.target.value)
                setPage(0)
              }}
              size='small'
              error={!!normalizedServiceId && !isValidServiceId}
              helperText={normalizedServiceId && !isValidServiceId ? 'Geçerli bir hizmet ID girin' : ' '}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value=''>Tümü</MenuItem>
              {services.map(service => (
                <MenuItem key={service.id} value={String(service.id)}>
                  {service.name}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant='contained'
              startIcon={<RiAddLine />}
              onClick={() => {
                if (isValidIndustryId && normalizedIndustryId) {
                  setCreateForm(prev => ({ ...prev, industry_id: normalizedIndustryId }))
                }

                setCreateOpen(true)
              }}
            >
              Ekle
            </Button>
          </Stack>
        }
        emptyText={
          isValidIndustryId && isValidServiceId
            ? 'Veri bulunamadı'
            : !isValidIndustryId
              ? 'Geçerli bir sektör ID girin'
              : 'Geçerli bir hizmet ID girin'
        }
        columns={[
          { header: 'ID', render: row => row.id },
          { header: 'Sektör', render: row => row.industry_name ?? String(row.industry_id ?? '-') },
          { header: 'Hizmet ID', render: row => String(row.service_id ?? '-') },
          { header: 'Hizmet', render: row => row.service_name ?? '-' }
        ]}
        actions={row => (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <IconButton size='small' color='error' onClick={() => setDeleteTarget(row)}>
              <RiDeleteBinLine size={18} />
            </IconButton>
          </Stack>
        )}
      />

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Yeni Eşleştirme</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              select
              label='Sektör'
              value={createForm.industry_id}
              onChange={e => setCreateForm(prev => ({ ...prev, industry_id: e.target.value }))}
              fullWidth
              helperText={isIndustriesLoading ? 'Sektörler yükleniyor...' : ' '}
            >
              <MenuItem value=''>Seçiniz</MenuItem>
              {industries.map(industry => (
                <MenuItem key={industry.id} value={String(industry.id)}>
                  {industry.type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label='Hizmet'
              value={createForm.service_id}
              onChange={e => setCreateForm(prev => ({ ...prev, service_id: e.target.value }))}
              fullWidth
              helperText={isServicesLoading ? 'Hizmetler yükleniyor...' : ' '}
            >
              <MenuItem value=''>Seçiniz</MenuItem>
              {services.map(service => (
                <MenuItem key={service.id} value={String(service.id)}>
                  {service.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>İptal</Button>
          <Button variant='contained' onClick={handleCreate} disabled={isCreating}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>Bu eşleştirmeyi silmek istediğinize emin misiniz?</DialogContent>
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
