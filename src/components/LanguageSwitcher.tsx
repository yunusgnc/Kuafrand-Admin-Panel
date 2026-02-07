'use client'

import React, { useState } from 'react'
import { useI18n } from '@/hooks/useI18n'
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/configs/i18n'
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Box, Tooltip } from '@mui/material'
import { RiTranslate2 } from 'react-icons/ri'

interface LanguageSwitcherProps {
  variant?: 'button' | 'menu' | 'dropdown'
  size?: 'small' | 'medium' | 'large'
  showFlag?: boolean
  showNativeName?: boolean
  className?: string
}

export function LanguageSwitcher({
  variant = 'button',
  size = 'medium',
  showFlag = true,
  showNativeName = true,
  className
}: LanguageSwitcherProps) {
  const { locale, changeLocale, direction } = useI18n()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    changeLocale(newLocale)
    handleClose()
  }

  const currentLocaleConfig = SUPPORTED_LOCALES[locale]

  const renderLanguageOption = (localeConfig: typeof currentLocaleConfig) => {
    return (
      <MenuItem
        key={localeConfig.code}
        onClick={() => handleLanguageChange(localeConfig.code)}
        selected={localeConfig.code === locale}
        sx={{
          minWidth: 200,
          direction: localeConfig.direction === 'rtl' ? 'rtl' : 'ltr',
          textAlign: localeConfig.direction === 'rtl' ? 'right' : 'left'
        }}
      >
        <ListItemIcon sx={{ minWidth: direction === 'rtl' ? 32 : 40 }}>
          {showFlag && (
            <Typography variant='h6' component='span'>
              {localeConfig.flag}
            </Typography>
          )}
        </ListItemIcon>
        <ListItemText
          primary={localeConfig.name}
          secondary={showNativeName ? localeConfig.nativeName : undefined}
          sx={{
            '& .MuiListItemText-primary': {
              textAlign: localeConfig.direction === 'rtl' ? 'right' : 'left'
            },
            '& .MuiListItemText-secondary': {
              textAlign: localeConfig.direction === 'rtl' ? 'right' : 'left'
            }
          }}
        />
      </MenuItem>
    )
  }

  if (variant === 'menu') {
    return (
      <>
        <Button
          onClick={handleClick}
          startIcon={<RiTranslate2 />}
          variant='outlined'
          size={size}
          className={className}
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          {currentLocaleConfig.flag} {currentLocaleConfig.name}
        </Button>
        <Menu
          id='language-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'language-button'
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {Object.values(SUPPORTED_LOCALES).map(renderLanguageOption)}
        </Menu>
      </>
    )
  }

  if (variant === 'dropdown') {
    return (
      <Box className={className}>
        <Tooltip title='Dil değiştir'>
          <Button onClick={handleClick} variant='text' size={size} sx={{ minWidth: 'auto', px: 1 }}>
            {showFlag && currentLocaleConfig.flag}
            <Typography
              variant='body2'
              sx={{
                ml: direction === 'rtl' ? 0 : showFlag ? 0.5 : 0,
                mr: direction === 'rtl' ? (showFlag ? 0.5 : 0) : 0
              }}
            >
              {currentLocaleConfig.code.toUpperCase()}
            </Typography>
          </Button>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          {Object.values(SUPPORTED_LOCALES).map(renderLanguageOption)}
        </Menu>
      </Box>
    )
  }

  // Default button variant
  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<RiTranslate2 />}
        variant='outlined'
        size={size}
        className={className}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
      >
        {currentLocaleConfig.flag} {currentLocaleConfig.name}
      </Button>
      <Menu
        id='language-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button'
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {Object.values(SUPPORTED_LOCALES).map(renderLanguageOption)}
      </Menu>
    </>
  )
}

export default LanguageSwitcher
