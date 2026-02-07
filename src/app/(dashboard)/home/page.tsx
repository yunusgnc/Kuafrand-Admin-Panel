'use client'

import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material'

import { useI18n } from '@/hooks/useI18n'

export default function Page() {
  const { t, locale } = useI18n()

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('navigation.home')} - {t('dashboard.welcome')}
      </Typography>

      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
        {t('dashboard.overview')} - Bu sayfa ana kontrol panelinizi gösterir.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6'>{t('navigation.home')}</Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                {t('dashboard.overview')} ve {t('dashboard.statistics')} burada görüntülenir.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6'>{t('dashboard.dashboard')}</Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                {t('dashboard.recentActivity')} ve {t('dashboard.quickActions')} burada bulunur.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6'>{t('dashboard.notifications')}</Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                {t('dashboard.messages')} ve bildirimler burada görüntülenir.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant='h6' gutterBottom>
          {t('settings.language')} Bilgisi
        </Typography>
        <Typography variant='body2'>
          Mevcut dil: <strong>{t(`languages.${locale}`)}</strong> ({locale})
        </Typography>
      </Paper>
    </Box>
  )
}
