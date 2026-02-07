'use client'

import { Box, Typography, Card, CardContent, Paper, Grid } from '@mui/material'

import { useI18n } from '@/hooks/useI18n'

export default function Page() {
  const { t, locale } = useI18n()

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('navigation.about')} - Hakkımızda
      </Typography>

      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
        Bu sayfa projemiz hakkında detaylı bilgi sunar.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                {t('common.about')} Projemiz
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Modern web teknolojileri kullanarak geliştirilmiş, kullanıcı dostu bir yönetim paneli.
                {t('dashboard.overview')} ve {t('dashboard.statistics')} özellikleri ile güçlü bir deneyim sunar.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                {t('settings.appearance')} ve {t('settings.layout')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Özelleştirilebilir {t('settings.theme')} seçenekleri, {t('settings.darkMode')} ve{' '}
                {t('settings.lightMode')} desteği. Responsive tasarım ile tüm cihazlarda mükemmel görünüm.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant='h6' gutterBottom>
          {t('settings.language')} Desteği
        </Typography>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Projemiz çok dilli yapıya sahiptir ve şu anda <strong>{t(`languages.${locale}`)}</strong> dilinde
          görüntülenmektedir.
        </Typography>
        <Typography variant='body2'>
          Desteklenen diller: {t('languages.tr')}
        </Typography>
      </Paper>
    </Box>
  )
}
