// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useI18n } from '@/hooks/useI18n'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Icon Imports
import {
  RiHomeSmileLine,
  RiInformationLine,
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

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <RiArrowRightSLine />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { t } = useI18n()

  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <RiCircleFill /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/home' icon={<RiHomeSmileLine />}>
          {t('menu.home')}
        </MenuItem>
        <MenuItem href='/about' icon={<RiInformationLine />}>
          {t('menu.about')}
        </MenuItem>

        <MenuSection label={t('menu.adminPanel')}>
          <SubMenu label={t('menu.adminPanel')} icon={<RiAdminLine />}>
            <MenuItem href='/admin/dashboard' icon={<RiDashboardLine />}>
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
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
