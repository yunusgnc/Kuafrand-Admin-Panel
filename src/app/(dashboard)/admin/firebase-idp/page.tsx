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

import { useGetFirebaseIdpsQuery } from '@/store/api/adminApi'

function getProviderLabel(name: string): string {
  const parts = name.split('/')
  const last = parts[parts.length - 1] ?? ''
  const provider = last.replace(/\.(com|org|net)$/i, '').toLowerCase()

  const labels: Record<string, string> = {
    apple: 'Apple',
    google: 'Google',
    facebook: 'Facebook',
    github: 'GitHub',
    microsoft: 'Microsoft',
    twitter: 'Twitter',
    yahoo: 'Yahoo',
    linkedin: 'LinkedIn'
  }

  
return labels[provider] ?? provider.charAt(0).toUpperCase() + provider.slice(1)
}

export default function AdminFirebaseIdpPage() {
  const { data, isLoading } = useGetFirebaseIdpsQuery()

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        Firebase OAuth IdP
      </Typography>

      {!isLoading && data?.message && (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {data.message}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Yapılandırılmış IdP&#39;ler
              </Typography>
              {isLoading ? (
                <Skeleton height={200} />
              ) : data?.idpConfigs && data.idpConfigs.length > 0 ? (
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Provider</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell>Client ID / Bundle ID</TableCell>
                        <TableCell>Detay</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.idpConfigs.map((config, i) => (
                        <TableRow key={config.name ?? i} hover>
                          <TableCell>
                            <Typography variant='body2' fontWeight={500}>
                              {getProviderLabel(config.name ?? '')}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {config.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size='small'
                              label={config.enabled ? 'Aktif' : 'Pasif'}
                              color={config.enabled ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            {config.clientId ? (
                              <Typography variant='body2' sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                {config.clientId}
                              </Typography>
                            ) : config.appleSignInConfig?.bundleIds?.length ? (
                              <Stack spacing={0.5}>
                                {config.appleSignInConfig.bundleIds.map(b => (
                                  <Chip key={b} size='small' label={b} variant='outlined' />
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant='body2' color='text.secondary'>
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              {config.clientSecret && (
                                <Typography variant='caption' color='text.secondary'>
                                  Client Secret: ****
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Yapılandırılmış IdP bulunamadı
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Desteklenen Provider&#39;lar
              </Typography>
              {isLoading ? (
                <Skeleton height={120} />
              ) : data?.supportedProviders && Object.keys(data.supportedProviders).length > 0 ? (
                <Stack direction='row' flexWrap='wrap' gap={1}>
                  {Object.entries(data.supportedProviders).map(([key, value]) => (
                    <Chip
                      key={key}
                      size='small'
                      label={`${key}: ${value}`}
                      variant='outlined'
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Desteklenen provider listesi bulunamadı
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
