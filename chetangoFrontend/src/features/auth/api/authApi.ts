import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      await httpClient.post('/auth/logout')
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] })
    },
  })
}