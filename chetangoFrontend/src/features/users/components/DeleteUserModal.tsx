// ============================================
// DELETE USER MODAL - Confirmación de Eliminación con Motivo
// ============================================

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (motivo: string) => void | Promise<void>
  userName: string
  isLoading?: boolean
}

const MOTIVOS_SUGERIDOS = [
  'Solicitud del usuario',
  'Inactividad prolongada (más de 6 meses)',
  'Duplicado / Cuenta errónea',
  'Migración a otra sede',
  'Incumplimiento de normas',
  'Usuario no regresa',
  'Otros (especificar abajo)',
]

export const DeleteUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}: DeleteUserModalProps) => {
  const [motivoSeleccionado, setMotivoSeleccionado] = useState('')
  const [motivoPersonalizado, setMotivoPersonalizado] = useState('')

  if (!isOpen) return null

  const handleConfirm = async () => {
    const motivoFinal = motivoSeleccionado === 'Otros (especificar abajo)' 
      ? motivoPersonalizado 
      : motivoSeleccionado

    if (!motivoFinal.trim()) {
      alert('Por favor selecciona o escribe un motivo de eliminación')
      return
    }

    await onConfirm(motivoFinal)
    handleClose()
  }

  const handleClose = () => {
    setMotivoSeleccionado('')
    setMotivoPersonalizado('')
    onClose()
  }

  const isOtrosSelected = motivoSeleccionado === 'Otros (especificar abajo)'

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[rgba(26,26,26,0.98)] border-2 border-[#ef4444] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-[rgba(239,68,68,0.3)]"
      >
        {/* Header */}
        <div className="bg-[rgba(239,68,68,0.15)] border-b border-[rgba(239,68,68,0.3)] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.2)] flex items-center justify-center">
              <AlertTriangle className="text-[#ef4444] w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[#f9fafb] text-xl font-bold">Eliminar Usuario</h2>
              <p className="text-[#9ca3af] text-sm">Borrado lógico (desactivación)</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Warning Message */}
          <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg p-4">
            <p className="text-[#f9fafb] font-medium mb-2">
              ¿Estás seguro de desactivar a <span className="text-[#ef4444]">{userName}</span>?
            </p>
            <p className="text-[#9ca3af] text-sm">
              El usuario pasará a estado <span className="text-[#f59e0b]">"Inactivo"</span> y no podrá acceder al sistema. 
              Podrás reactivarlo más tarde si es necesario.
            </p>
          </div>

          {/* Motivo - Selector */}
          <div>
            <label className="block text-[#f9fafb] text-sm font-medium mb-3">
              Motivo de Desactivación: <span className="text-[#ef4444]">*</span>
            </label>
            <select
              value={motivoSeleccionado}
              onChange={(e) => setMotivoSeleccionado(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.2)] text-[#f9fafb] focus:outline-none focus:border-[#ef4444] focus:bg-[rgba(255,255,255,0.08)] transition-all disabled:opacity-50"
            >
              <option value="">Selecciona un motivo...</option>
              {MOTIVOS_SUGERIDOS.map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
          </div>

          {/* Motivo Personalizado */}
          {isOtrosSelected && (
            <div>
              <label className="block text-[#9ca3af] text-sm mb-2">
                Especifica el motivo:
              </label>
              <textarea
                value={motivoPersonalizado}
                onChange={(e) => setMotivoPersonalizado(e.target.value)}
                disabled={isLoading}
                rows={3}
                placeholder="Describe el motivo de desactivación..."
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.2)] text-[#f9fafb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#ef4444] focus:bg-[rgba(255,255,255,0.08)] transition-all resize-none disabled:opacity-50"
              />
            </div>
          )}

          {/* Info adicional */}
          <div className="bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] rounded-lg p-3">
            <p className="text-[#60a5fa] text-xs flex items-start gap-2">
              <span className="text-base">ℹ️</span>
              <span>
                Este motivo quedará registrado para trazabilidad. El usuario podrá ser reactivado desde la pestaña "Inactivos".
              </span>
            </p>
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="border-t border-[rgba(64,64,64,0.3)] p-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !motivoSeleccionado || (isOtrosSelected && !motivoPersonalizado.trim())}
            className="flex-1 px-6 py-3 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Desactivando...
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                Confirmar Desactivación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
