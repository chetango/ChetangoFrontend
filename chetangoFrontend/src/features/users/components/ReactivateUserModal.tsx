// ============================================
// REACTIVATE USER MODAL
// ============================================

import { X } from 'lucide-react'

interface ReactivateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
  isLoading: boolean
}

export const ReactivateUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading,
}: ReactivateUserModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[rgba(26,26,26,0.98)] border-2 border-[#10b981] backdrop-blur rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl font-bold text-[#10b981]">Reactivar Usuario</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que deseas reactivar al usuario{' '}
            <span className="font-semibold text-white">{userName}</span>?
          </p>

          <div className="bg-[rgba(16,185,129,0.1)] border-l-4 border-[#10b981] p-4 rounded">
            <p className="text-sm text-gray-300">
              <strong className="text-[#10b981]">Nota:</strong> El usuario podrá volver a acceder al
              sistema con sus credenciales existentes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[rgba(255,255,255,0.1)]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#10b981] hover:bg-[#0d9668] text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Reactivando...
              </>
            ) : (
              'Reactivar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
