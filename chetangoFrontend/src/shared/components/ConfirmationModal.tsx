// ============================================
// CONFIRMATION MODAL - Modal de Confirmación Reutilizable
// ============================================

import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}: ConfirmationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const variantColors = {
    danger: {
      icon: 'text-[#ef4444]',
      button: 'bg-[#ef4444] hover:bg-[#dc2626]',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    },
    warning: {
      icon: 'text-[#f59e0b]',
      button: 'bg-[#f59e0b] hover:bg-[#d97706]',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    },
    info: {
      icon: 'text-[#3b82f6]',
      button: 'bg-[#3b82f6] hover:bg-[#2563eb]',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    },
  }

  const colors = variantColors[variant]

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
      {/* Backdrop con blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative z-10 bg-[rgba(26,26,26,0.98)] rounded-2xl ${colors.glow} w-full max-w-md border border-[rgba(64,64,64,0.3)] overflow-hidden animate-in fade-in duration-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(64,64,64,0.3)]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-[rgba(26,26,26,0.6)] ${colors.icon}`}>
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#f9fafb]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgba(64,64,64,0.3)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#9ca3af]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#d1d5db] text-base leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-[rgba(64,64,64,0.3)] bg-[rgba(0,0,0,0.2)]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[rgba(64,64,64,0.2)] hover:bg-[rgba(64,64,64,0.3)] text-[#f9fafb] rounded-lg font-medium transition-colors min-h-[44px]"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 ${colors.button} text-white rounded-lg font-medium transition-colors min-h-[44px]`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
