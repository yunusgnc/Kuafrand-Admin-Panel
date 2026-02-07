import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: [
    'AdminMe',
    'Users',
    'Workplaces',
    'Workers',
    'Appointments',
    'Industries',
    'Services',
    'IndustryServices',
    'Permissions',
    'Roles',
    'WorkerPermissions',
    'Dashboard',
    'SystemStats',
    'BlockedTimes',
    'Reminders',
    'CancellationReasons',
    'AppointmentCancellations',
    'FirebaseIdp',
    'Admins',
    'AuditLogs',
    'SystemHealth',
    'Subscriptions',
    'Config'
  ],
  endpoints: () => ({})
})
