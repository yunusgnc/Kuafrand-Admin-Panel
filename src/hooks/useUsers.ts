import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// API functions
const fetchUsers = async () => {
  const response = await fetch('/api/users')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const createUser = async (userData: any) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const updateUser = async ({ id, userData }: { id: string; userData: any }) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const deleteUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

// Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id
  })
}

// Mutation hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      // Update the user in cache
      queryClient.setQueryData(['user', variables.id], data)
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ['user', id] })
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
