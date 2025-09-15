import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state: AuthState, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('auth_token', action.payload.token)
    },
    logout: (state: AuthState) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('auth_token')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions