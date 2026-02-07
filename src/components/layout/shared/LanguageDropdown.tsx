'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

// Type Imports
import type { SupportedLocale } from '@/configs/i18n'
import { SUPPORTED_LOCALES } from '@/configs/i18n'

// Hook Imports
import { useI18n } from '@/hooks/useI18n'
import { useSettings } from '@/hooks/useSettings'

const LanguageDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { skin } = useSettings()
  const { locale, changeLocale } = useI18n()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    changeLocale(newLocale)
    handleClose()
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <i className='ri-translate-2' />
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[200px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  {Object.values(SUPPORTED_LOCALES).map(localeConfig => (
                    <MenuItem
                      key={localeConfig.code}
                      onClick={() => handleLanguageChange(localeConfig.code)}
                      selected={locale === localeConfig.code}
                      className='pli-4'
                      sx={{
                        direction: localeConfig.direction === 'rtl' ? 'rtl' : 'ltr'
                      }}
                    >
                      <ListItemIcon>
                        <Typography variant='h6' component='span'>
                          {localeConfig.flag}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText primary={localeConfig.name} secondary={localeConfig.nativeName} />
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default LanguageDropdown
