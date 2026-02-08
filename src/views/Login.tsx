'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

import classnames from 'classnames'

import type { Mode } from '@core/types'

import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

import themeConfig from '@configs/themeConfig'

import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import { useI18n } from '@/hooks/useI18n'
import { useAuth } from '@/hooks/useAuth'

const LoginV2 = ({ mode }: { mode: Mode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const darkImg = '/images/pages/auth-v2-mask-1-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-1-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  const router = useRouter()
  const { settings } = useSettings()
  const { t } = useI18n()
  const { login, isLoading, error, resetError, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='pli-6 max-lg:mbs-40 lg:mbe-24'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[673px] max-is-full bs-auto'
          />
        </div>
        <img src={authBackground} className='absolute bottom-[4%] z-[-1] is-full max-md:hidden' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div>
            <Typography variant='h4'>
              {t('auth.welcomeBack')} {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography className='mbs-1'>{t('auth.loginToAccount')}</Typography>
          </div>
          {error && (
            <Alert severity='error' onClose={resetError}>
              {error}
            </Alert>
          )}
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <TextField
              autoFocus
              fullWidth
              label={t('auth.email')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label={t('auth.password')}
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
              <FormControlLabel control={<Checkbox />} label={t('auth.rememberMe')} />
              <Typography className='text-end' color='primary.main' component={Link}>
                {t('auth.forgotPassword')}
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color='inherit' /> : t('auth.signIn')}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>{t('auth.dontHaveAccount')}</Typography>
              <Typography component={Link} color='primary.main'>
                {t('auth.createAccount')}
              </Typography>
            </div>
            <Divider className='gap-3 text-textPrimary'>veya</Divider>
            <div className='flex justify-center items-center gap-2'>
              <IconButton size='small' className='text-facebook'>
                <i className='ri-facebook-fill' />
              </IconButton>
              <IconButton size='small' className='text-twitter'>
                <i className='ri-twitter-fill' />
              </IconButton>
              <IconButton size='small' className='text-textPrimary'>
                <i className='ri-github-fill' />
              </IconButton>
              <IconButton size='small' className='text-googlePlus'>
                <i className='ri-google-fill' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
