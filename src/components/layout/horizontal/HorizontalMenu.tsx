// MUI Imports
import { useTheme } from '@mui/material/styles'

// Type Imports
import {
  RiArrowRightSLine,
  RiCircleFill,
  RiDashboardLine,
  RiUserLine,
  RiBuildingLine,
  RiTeamLine,
  RiShieldKeyholeLine,
  RiAdminLine,
  RiCalendarEventLine,
  RiBriefcase4Line,
  RiServiceLine,
  RiLinksLine,
  RiTimerLine,
  RiNotification3Line,
  RiFileWarningLine,
  RiFileList3Line,
  RiDatabase2Line,
  RiShieldUserLine,
  RiFileSearchLine,
  RiPulseLine,
  RiVipCrown2Line,
  RiSettings3Line
} from 'react-icons/ri'

import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import HorizontalNav, { Menu, MenuItem, SubMenu } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useI18n } from '@/hooks/useI18n'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <RiArrowRightSLine />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <RiArrowRightSLine />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = () => {
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { t } = useI18n()

  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor: 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        renderExpandedMenuItemIcon={{ icon: <RiCircleFill /> }}
        menuItemStyles={menuItemStyles(theme, 'ri-circle-fill')}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 4 : 14),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <RiCircleFill /> }
        }}
      >
        <SubMenu label={t('menu.adminPanel')} icon={<RiAdminLine />}>
          <MenuItem href='/dashboard' icon={<RiDashboardLine />}>
            {t('menu.adminDashboard')}
          </MenuItem>
          <MenuItem href='/admin/admins' icon={<RiShieldUserLine />}>
            {t('menu.admins')}
          </MenuItem>
          <MenuItem href='/admin/audit-logs' icon={<RiFileSearchLine />}>
            {t('menu.auditLogs')}
          </MenuItem>
          <MenuItem href='/admin/system-health' icon={<RiPulseLine />}>
            {t('menu.systemHealth')}
          </MenuItem>
          <MenuItem href='/admin/subscriptions' icon={<RiVipCrown2Line />}>
            {t('menu.subscriptions')}
          </MenuItem>
          <MenuItem href='/admin/config' icon={<RiSettings3Line />}>
            {t('menu.config')}
          </MenuItem>
          <MenuItem href='/admin/users' icon={<RiUserLine />}>
            {t('menu.users')}
          </MenuItem>
          <MenuItem href='/admin/workplaces' icon={<RiBuildingLine />}>
            {t('menu.workplaces')}
          </MenuItem>
          <MenuItem href='/admin/workers' icon={<RiTeamLine />}>
            {t('menu.workers')}
          </MenuItem>
          <MenuItem href='/admin/appointments' icon={<RiCalendarEventLine />}>
            {t('menu.appointments')}
          </MenuItem>
          <MenuItem href='/admin/industries' icon={<RiBriefcase4Line />}>
            {t('menu.industries')}
          </MenuItem>
          <MenuItem href='/admin/services' icon={<RiServiceLine />}>
            {t('menu.services')}
          </MenuItem>
          <MenuItem href='/admin/industry-services' icon={<RiLinksLine />}>
            {t('menu.industryServices')}
          </MenuItem>
          <MenuItem href='/admin/blocked-times' icon={<RiTimerLine />}>
            {t('menu.blockedTimes')}
          </MenuItem>
          <MenuItem href='/admin/reminders' icon={<RiNotification3Line />}>
            {t('menu.reminders')}
          </MenuItem>
          <MenuItem href='/admin/cancellation-reasons' icon={<RiFileWarningLine />}>
            {t('menu.cancellationReasons')}
          </MenuItem>
          <MenuItem href='/admin/appointment-cancellations' icon={<RiFileList3Line />}>
            {t('menu.appointmentCancellations')}
          </MenuItem>
          <MenuItem href='/admin/roles' icon={<RiShieldKeyholeLine />}>
            {t('menu.roles')}
          </MenuItem>
          <MenuItem href='/admin/firebase-idp' icon={<RiDatabase2Line />}>
            {t('menu.firebaseIdp')}
          </MenuItem>
        </SubMenu>
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
