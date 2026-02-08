'use client'

import { useI18n } from '@/hooks/useI18n'
import { Box, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

const NotFound = () => {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography className='font-medium text-8xl' color='text.primary'>
        404
      </Typography>
      <Typography variant='h4'>{t('errors.pageNotFound')}</Typography>
      <Typography sx={{ mt: 2, mb: 4, maxWidth: 400 }}>{t('errors.pageNotFoundDescription')}</Typography>
      <Button variant='contained' onClick={() => router.push('/dashboard')}>
        {t('navigation.home')}
      </Button>
    </Box>
  )
}

export default NotFound
