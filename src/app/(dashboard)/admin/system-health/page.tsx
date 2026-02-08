'use client'

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import {
  RiDatabase2Line,
  RiFirebaseFill,
  RiNotification3Line,
  RiCpuLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine
} from 'react-icons/ri'
import { useGetSystemHealthQuery } from '@/store/api/adminApi'

interface SystemHealthResponse {
  status?: string
  timestamp?: string
  database?: {
    connected?: boolean
    latency_ms?: number
    server_time?: string
    database_name?: string
    pool?: {
      total_connections?: number
      idle_connections?: number
      waiting_requests?: number
    }
  }
  firebase?: {
    configured?: boolean
  }
  push_queue?: {
    queue_size?: number
    is_processing?: boolean
  }
  server?: {
    uptime_seconds?: number
    node_version?: string
    platform?: string
    memory?: {
      rss_mb?: number
      heap_used_mb?: number
      heap_total_mb?: number
      external_mb?: number
    }
    environment?: string
  }
  table_stats?: Array<{
    table_name?: string
    row_count?: string | number
  }>
}

function StatusChip({ ok }: { ok?: boolean }) {
  if (ok === undefined) return <Chip size='small' label='-' variant='outlined' />
  return (
    <Chip
      size='small'
      icon={ok ? <RiCheckboxCircleLine size={14} /> : <RiErrorWarningLine size={14} />}
      color={ok ? 'success' : 'error'}
      label={ok ? 'OK' : 'Hata'}
    />
  )
}

function formatUptime(seconds?: number) {
  if (seconds == null || typeof seconds !== 'number') return '-'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}g`)
  if (h > 0) parts.push(`${h}s`)
  parts.push(`${m}dk`)
  return parts.join(' ')
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('tr-TR')
  } catch {
    return dateStr
  }
}

export default function SystemHealthPage() {
  const { data, isLoading } = useGetSystemHealthQuery()
  const health = data as SystemHealthResponse | undefined

  const db = health?.database
  const firebase = health?.firebase
  const pushQueue = health?.push_queue
  const server = health?.server
  const memory = server?.memory
  const tableStats = health?.table_stats

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          Sistem Sağlığı
        </Typography>
        {!isLoading && health?.status && (
          <Chip
            label={health.status === 'healthy' ? 'Sağlıklı' : health.status}
            color={health.status === 'healthy' ? 'success' : 'warning'}
            size='small'
          />
        )}
      </Stack>

      {!isLoading && health?.timestamp && (
        <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 2 }}>
          Son güncelleme: {formatDate(health.timestamp)}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              >
                <RiDatabase2Line size={24} />
              </Box>
              <Box flex={1}>
                {isLoading ? (
                  <Skeleton width={80} height={28} />
                ) : (
                  <StatusChip ok={db?.connected} />
                )}
                <Typography variant='body2' color='text.secondary'>
                  Veritabanı
                </Typography>
                {db?.latency_ms != null && (
                  <Typography variant='caption' color='text.secondary'>
                    {db.latency_ms} ms
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'warning.main',
                  color: 'warning.contrastText'
                }}
              >
                <RiFirebaseFill size={24} />
              </Box>
              <Box flex={1}>
                {isLoading ? (
                  <Skeleton width={80} height={28} />
                ) : (
                  <StatusChip ok={firebase?.configured} />
                )}
                <Typography variant='body2' color='text.secondary'>
                  Firebase
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'info.main',
                  color: 'info.contrastText'
                }}
              >
                <RiNotification3Line size={24} />
              </Box>
              <Box flex={1}>
                {isLoading ? (
                  <Skeleton width={80} height={28} />
                ) : (
                  <StatusChip ok={!pushQueue?.is_processing} />
                )}
                <Typography variant='body2' color='text.secondary'>
                  Push Kuyruğu
                </Typography>
                {pushQueue?.queue_size != null && (
                  <Typography variant='caption' color='text.secondary'>
                    Kuyruk: {pushQueue.queue_size}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'success.main',
                  color: 'success.contrastText'
                }}
              >
                <RiTimeLine size={24} />
              </Box>
              <Box flex={1}>
                {isLoading ? (
                  <Skeleton width={80} height={28} />
                ) : (
                  <Typography variant='subtitle1' fontWeight={600}>
                    {formatUptime(server?.uptime_seconds)}
                  </Typography>
                )}
                <Typography variant='body2' color='text.secondary'>
                  Çalışma Süresi
                </Typography>
                {server?.node_version && (
                  <Typography variant='caption' color='text.secondary'>
                    {server.node_version}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RiCpuLine size={20} />
                Bellek Kullanımı
              </Typography>
              {isLoading ? (
                <Skeleton height={100} />
              ) : memory ? (
                <Stack spacing={1}>
                  <Typography variant='body2'>
                    RSS: {memory.rss_mb ?? '-'} MB
                  </Typography>
                  <Typography variant='body2'>
                    Heap Kullanılan: {memory.heap_used_mb ?? '-'} MB
                  </Typography>
                  <Typography variant='body2'>
                    Heap Toplam: {memory.heap_total_mb ?? '-'} MB
                  </Typography>
                  <Typography variant='body2'>
                    External: {memory.external_mb ?? '-'} MB
                  </Typography>
                  {server?.environment && (
                    <Typography variant='caption' color='text.secondary'>
                      Ortam: {server.environment}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Bellek bilgisi bulunamadı
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Veritabanı Havuzu
              </Typography>
              {isLoading ? (
                <Skeleton height={80} />
              ) : db?.pool ? (
                <Stack spacing={1}>
                  <Typography variant='body2'>
                    Toplam Bağlantı: {db.pool.total_connections ?? '-'}
                  </Typography>
                  <Typography variant='body2'>
                    Boşta: {db.pool.idle_connections ?? '-'}
                  </Typography>
                  <Typography variant='body2'>
                    Bekleyen: {db.pool.waiting_requests ?? '-'}
                  </Typography>
                  {db.database_name && (
                    <Typography variant='caption' color='text.secondary'>
                      DB: {db.database_name}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Havuz bilgisi bulunamadı
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Tablo İstatistikleri
              </Typography>
              {isLoading ? (
                <Skeleton height={200} />
              ) : tableStats && Array.isArray(tableStats) && tableStats.length > 0 ? (
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tablo</TableCell>
                        <TableCell align='right'>Kayıt Sayısı</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableStats.map((row, i) => (
                        <TableRow key={row.table_name ?? i} hover>
                          <TableCell>{row.table_name ?? '-'}</TableCell>
                          <TableCell align='right'>{row.row_count ?? '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Tablo istatistiği bulunamadı
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
