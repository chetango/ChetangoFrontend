import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthStateType } from '@/features/auth/types/authTypes'

// ESTADO INICIAL DE UI PARA AUTENTICACIÓN
const initialState: AuthStateType = {
  isLoading: false,
  error: null,
  isInitialized: false,
}

// SLICE PARA ESTADO DE UI DE AUTENTICACIÓN (NO DATOS DE SESIÓN)
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setLoading, setError, setInitialized, clearError } = authSlice.actions