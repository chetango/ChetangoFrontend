// ============================================
// SEGURIDAD CARD COMPONENT - ADMIN
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { AlertCircle, Calendar, Chrome, Eye, EyeOff, Key, Lock, LogOut, Monitor, Save, Shield } from 'lucide-react'
import { useState } from 'react'
import { useCambiarPasswordMutation, useCerrarOtrasSesionesMutation } from '../api/profileQueries'
import type { SeguridadInfo } from '../types/profile.types'

interface SeguridadCardProps {
  seguridadInfo?: SeguridadInfo
}

export const SeguridadCard = ({ seguridadInfo }: SeguridadCardProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nuevo: false,
    confirmar: false,
  })
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')

  const cambiarPasswordMutation = useCambiarPasswordMutation()
  const cerrarSesionesMutation = useCerrarOtrasSesionesMutation()

  const handleChangePassword = () => {
    // Validaciones
    if (passwordForm.passwordNuevo !== passwordForm.confirmarPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    if (passwordForm.passwordNuevo.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setPasswordError('')
    cambiarPasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        setPasswordForm({
          passwordActual: '',
          passwordNuevo: '',
          confirmarPassword: '',
        })
        setIsChangingPassword(false)
      },
      onError: (error: any) => {
        setPasswordError(error.response?.data?.message || 'Error al cambiar la contraseña')
      },
    })
  }

  const handleCerrarOtrasSesiones = () => {
    if (confirm('¿Estás seguro de cerrar todas las demás sesiones activas?')) {
      cerrarSesionesMutation.mutate()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-[#ef4444]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Seguridad</h3>
      </div>

      <div className="space-y-6">
        {/* Cambiar Contraseña */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#9ca3af]" />
              <h4 className="text-[#f9fafb] font-medium">Cambiar Contraseña</h4>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] text-sm transition-all duration-300"
              >
                Cambiar
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-3 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
              {/* Contraseña Actual */}
              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Contraseña Actual</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type={showPasswords.actual ? 'text' : 'password'}
                    value={passwordForm.passwordActual}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, passwordActual: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#ef4444] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, actual: !showPasswords.actual })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#f9fafb]"
                  >
                    {showPasswords.actual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type={showPasswords.nuevo ? 'text' : 'password'}
                    value={passwordForm.passwordNuevo}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, passwordNuevo: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#ef4444] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, nuevo: !showPasswords.nuevo })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#f9fafb]"
                  >
                    {showPasswords.nuevo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type={showPasswords.confirmar ? 'text' : 'password'}
                    value={passwordForm.confirmarPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmarPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#ef4444] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirmar: !showPasswords.confirmar })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#f9fafb]"
                  >
                    {showPasswords.confirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
                  <AlertCircle className="w-4 h-4 text-[#ef4444]" />
                  <span className="text-[#ef4444] text-sm">{passwordError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={cambiarPasswordMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {cambiarPasswordMutation.isPending ? 'Guardando...' : 'Guardar Nueva Contraseña'}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordForm({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' })
                    setPasswordError('')
                  }}
                  disabled={cambiarPasswordMutation.isPending}
                  className="px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
              <p className="text-[#9ca3af] text-sm">
                Última modificación: {seguridadInfo?.ultimoCambioPassword ? formatDate(seguridadInfo.ultimoCambioPassword) : 'No disponible'}
              </p>
            </div>
          )}
        </div>

        {/* Sesiones Activas */}
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#9ca3af]" />
              <h4 className="text-[#f9fafb] font-medium">Sesiones Activas</h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10b981] text-xs font-medium">
              {seguridadInfo?.sesionesActivas || 1} sesión{(seguridadInfo?.sesionesActivas || 1) > 1 ? 'es' : ''}
            </span>
          </div>

          {seguridadInfo && seguridadInfo.sesionesActivas > 1 && (
            <button
              onClick={handleCerrarOtrasSesiones}
              disabled={cerrarSesionesMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] font-medium transition-all duration-300 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {cerrarSesionesMutation.isPending ? 'Cerrando...' : 'Cerrar Otras Sesiones'}
            </button>
          )}
        </div>

        {/* Historial de Accesos */}
        {seguridadInfo?.historialAccesos && seguridadInfo.historialAccesos.length > 0 && (
          <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#9ca3af]" />
              <h4 className="text-[#f9fafb] font-medium">Historial de Accesos Recientes</h4>
            </div>

            <div className="space-y-3">
              {seguridadInfo.historialAccesos.slice(0, 5).map((acceso, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Chrome className="w-4 h-4 text-[#9ca3af] mt-0.5" />
                      <div>
                        <p className="text-[#f9fafb] text-sm font-medium">{acceso.navegador}</p>
                        <p className="text-[#9ca3af] text-xs mt-1">{acceso.dispositivo}</p>
                        <p className="text-[#6b7280] text-xs mt-1">IP: {acceso.ip}</p>
                      </div>
                    </div>
                    <span className="text-[#9ca3af] text-xs whitespace-nowrap">
                      {formatDate(acceso.fecha)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassPanel>
  )
}
