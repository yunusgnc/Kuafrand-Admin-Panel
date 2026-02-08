'use client'

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  RiUserLine,
  RiBuildingLine,
  RiTeamLine,
  RiCalendarEventLine,
  RiServiceLine,
  RiBriefcase4Line
} from 'react-icons/ri'

import type { DashboardData } from '@/types/admin'
import { useGetDashboardQuery, useGetSystemStatsQuery } from '@/store/api/adminApi'

const statCards = [
  { key: 'total_users', label: 'Toplam Kullanıcı', icon: <RiUserLine size={28} />, color: '#4C8BF5' },
  { key: 'total_workplaces', label: 'Toplam İşyeri', icon: <RiBuildingLine size={28} />, color: '#28C76F' },
  { key: 'total_workers', label: 'Toplam Çalışan', icon: <RiTeamLine size={28} />, color: '#FF9F43' },
  { key: 'total_appointments', label: 'Toplam Randevu', icon: <RiCalendarEventLine size={28} />, color: '#00CFE8' },
  { key: 'total_services', label: 'Toplam Hizmet', icon: <RiServiceLine size={28} />, color: '#EA5455' },
  { key: 'total_industries', label: 'Toplam Sektör', icon: <RiBriefcase4Line size={28} />, color: '#1ABC9C' }
]

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useGetDashboardQuery()
  const { data: stats } = useGetSystemStatsQuery()

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map(card => (
          <Grid item xs={12} sm={6} md={3} key={card.key}>
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
                    bgcolor: `${card.color}20`,
                    color: card.color
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  {isLoading ? (
                    <Skeleton width={60} height={36} />
                  ) : (
                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                      {String(dashboard?.[card.key as keyof DashboardData] ?? 0)}
                    </Typography>
                  )}
                  <Typography variant='body2' color='text.secondary'>
                    {card.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {stats && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Sistem İstatistikleri
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant='subtitle1' sx={{ mb: 1, fontWeight: 600 }}>
                  Aylık Büyüme
                </Typography>
                {stats.monthly_growth.length === 0 ? (
                  <Typography variant='body2' color='text.secondary'>
                    Veri bulunamadı
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Ay</TableCell>
                          <TableCell align='right'>Yeni Kullanıcı</TableCell>
                          <TableCell align='right'>Yeni Çalışan</TableCell>
                          <TableCell align='right'>Yeni İşyeri</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.monthly_growth.map(row => (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell align='right'>{row.new_users}</TableCell>
                            <TableCell align='right'>{row.new_workers}</TableCell>
                            <TableCell align='right'>{row.new_workplaces}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant='subtitle1' sx={{ mb: 1, fontWeight: 600 }}>
                  Popüler Hizmetler
                </Typography>
                {stats.popular_services.length === 0 ? (
                  <Typography variant='body2' color='text.secondary'>
                    Veri bulunamadı
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Hizmet</TableCell>
                          <TableCell align='right'>Çalışan</TableCell>
                          <TableCell align='right'>Randevu</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.popular_services.map(service => (
                          <TableRow key={service.name}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell align='right'>{service.worker_count}</TableCell>
                            <TableCell align='right'>{service.appointment_count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant='subtitle1' sx={{ mb: 1, fontWeight: 600 }}>
                  Sektör Dağılımı
                </Typography>
                {stats.industry_distribution.length === 0 ? (
                  <Typography variant='body2' color='text.secondary'>
                    Veri bulunamadı
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tür</TableCell>
                          <TableCell align='right'>İşyeri</TableCell>
                          <TableCell align='right'>Çalışan</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.industry_distribution.map(row => (
                          <TableRow key={row.type}>
                            <TableCell>{row.type}</TableCell>
                            <TableCell align='right'>{row.workplace_count}</TableCell>
                            <TableCell align='right'>{row.worker_count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
