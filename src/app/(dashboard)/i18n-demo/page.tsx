'use client'

import React from 'react'

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  AlertTitle
} from '@mui/material'

import { RiTranslate2, RiFlagLine, RiSettings3Line } from 'react-icons/ri'

import { useI18n } from '@/hooks/useI18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

function I18nDemoPage() {
  const { t, locale, direction } = useI18n()

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('dashboard.welcome')} - i18n Demo
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        <AlertTitle>{t('common.info')}</AlertTitle>
        {t('settings.language')} örneği - Bu sayfa çok dilli yapının nasıl çalıştığını gösterir.
      </Alert>

      <Grid container spacing={3}>
        {/* Language Switcher */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                <RiTranslate2
                  style={{
                    marginRight: direction === 'rtl' ? 0 : 8,
                    marginLeft: direction === 'rtl' ? 8 : 0,
                    verticalAlign: 'middle'
                  }}
                />
                {t('settings.language')} Değiştirici
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LanguageSwitcher variant='button' size='large' />
              </Box>
              <Box sx={{ mt: 2 }}>
                <LanguageSwitcher variant='dropdown' size='small' />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Language Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                <RiFlagLine
                  style={{
                    marginRight: direction === 'rtl' ? 0 : 8,
                    marginLeft: direction === 'rtl' ? 8 : 0,
                    verticalAlign: 'middle'
                  }}
                />
                Mevcut {t('settings.language')} Bilgisi
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <RiTranslate2 />
                  </ListItemIcon>
                  <ListItemText primary='Kod' secondary={locale} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RiTranslate2 />
                  </ListItemIcon>
                  <ListItemText
                    primary='Yön'
                    secondary={direction === 'rtl' ? 'Sağdan Sola (RTL)' : 'Soldan Sağa (LTR)'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Translation Examples */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                <RiTranslate2
                  style={{
                    marginRight: direction === 'rtl' ? 0 : 8,
                    marginLeft: direction === 'rtl' ? 8 : 0,
                    verticalAlign: 'middle'
                  }}
                />
                Çeviri Örnekleri
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {t('navigation.home')}
                    </Typography>
                    <Typography variant='h6'>{t('dashboard.welcome')}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {t('navigation.about')}
                    </Typography>
                    <Typography variant='h6'>{t('dashboard.overview')}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {t('settings.language')}
                    </Typography>
                    <Typography variant='h6'>{t('dashboard.statistics')}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Language Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                <RiSettings3Line
                  style={{
                    marginRight: direction === 'rtl' ? 0 : 8,
                    marginLeft: direction === 'rtl' ? 8 : 0,
                    verticalAlign: 'middle'
                  }}
                />
                {t('settings.language')} Ayarları
              </Typography>
              <Typography variant='body1' gutterBottom>
                Mevcut dil: <strong>{t(`languages.${locale}`)}</strong> ({locale})
              </Typography>
              <Typography variant='body1' gutterBottom>
                Desteklenen diller: {t('languages.tr')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default I18nDemoPage
