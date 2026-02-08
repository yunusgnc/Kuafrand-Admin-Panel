'use client'

import React from 'react'

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material'

import { RiDeleteBinLine, RiEditLine, RiAddLine } from 'react-icons/ri'

import { useSettings } from '@/hooks/useSettings'
import { useI18n } from '@/hooks/useI18n'
import { useNotifications } from '@/hooks/useNotifications'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers'

const ReduxDemoPage = () => {
  // Redux hooks
  const { mode, skin, layout, setMode, setSkin, setLayout } = useSettings()
  const { locale, t, changeLocale } = useI18n()
  const { notifications, unreadCount, addNotification, markAllAsRead } = useNotifications()

  // React Query hooks
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const handleAddNotification = () => {
    addNotification({
      title: 'New Notification',
      subtitle: 'This is a test notification',
      time: new Date().toLocaleTimeString(),
      read: false,
      avatarIcon: 'ri-notification-2-line',
      avatarColor: 'info'
    })
  }

  const handleCreateUser = () => {
    createUserMutation.mutate({
      name: 'New User',
      email: 'newuser@example.com'
    })
  }

  const handleUpdateUser = (id: string) => {
    updateUserMutation.mutate({
      id,
      userData: {
        name: 'Updated User',
        email: 'updated@example.com'
      }
    })
  }

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate(id)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Redux Toolkit + React Query Demo
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        <AlertTitle>Modern State Management</AlertTitle>
        Bu sayfa Redux Toolkit ve React Query kullanımını gösterir.
      </Alert>

      <Grid container spacing={3}>
        {/* Settings Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Settings (Redux)
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='textSecondary'>
                  Current Mode: {mode}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Current Skin: {skin}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Current Layout: {layout}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Current Language: {locale}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size='small' onClick={() => setMode('light')}>
                  Light Mode
                </Button>
                <Button size='small' onClick={() => setMode('dark')}>
                  Dark Mode
                </Button>
                <Button size='small' onClick={() => setSkin('bordered')}>
                  Bordered Skin
                </Button>
                <Button size='small' onClick={() => setLayout('horizontal')}>
                  Horizontal Layout
                </Button>
                <Button size='small' onClick={() => changeLocale('tr')}>
                  Türkçe
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Notifications (Redux)
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='textSecondary'>
                  Unread Count: {unreadCount}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Total Notifications: {notifications.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size='small' onClick={handleAddNotification} startIcon={<RiAddLine size={18} />}>
                  Add Notification
                </Button>
                <Button size='small' onClick={markAllAsRead}>
                  Mark All Read
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Users Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Users (React Query)
              </Typography>

              {usersLoading && (
                <Typography variant='body2' color='textSecondary'>
                  Loading users...
                </Typography>
              )}

              {usersError && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  Error loading users: {usersError.message}
                </Alert>
              )}

              {users && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      size='small'
                      onClick={handleCreateUser}
                      disabled={createUserMutation.isPending}
                      startIcon={<RiAddLine size={18} />}
                    >
                      {createUserMutation.isPending ? 'Creating...' : 'Add User'}
                    </Button>
                  </Box>

                  <List>
                    {users.map((user: any) => (
                      <ListItem key={user.id} divider>
                        <ListItemText primary={user.name} secondary={user.email} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge='end'
                            onClick={() => handleUpdateUser(user.id)}
                            disabled={updateUserMutation.isPending}
                          >
                            <RiEditLine size={18} />
                          </IconButton>
                          <IconButton
                            edge='end'
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUserMutation.isPending}
                          >
                            <RiDeleteBinLine size={18} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Translation Examples */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Translation Examples
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={t('common.save')} color='primary' />
                <Chip label={t('common.cancel')} color='secondary' />
                <Chip label={t('dashboard.welcome')} color='success' />
                <Chip label={t('auth.signIn')} color='info' />
                <Chip label={t('validation.minLength', { min: 8 })} color='warning' />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReduxDemoPage
