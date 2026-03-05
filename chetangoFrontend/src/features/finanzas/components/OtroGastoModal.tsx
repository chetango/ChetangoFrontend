// ============================================
// OTRO GASTO MODAL - CREAR/EDITAR
// ============================================

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CategoriaGastoDTO, CrearOtroGastoDTO, Sede } from '../types/finanzasTypes'
import { SEDE_LABELS } from '../types/finanzasTypes'

interface OtroGastoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CrearOtroGastoDTO) => Promise<void>
  categorias: CategoriaGastoDTO[]
  isSubmitting: boolean
  initialData?: CrearOtroGastoDTO | null
}

export function OtroGastoModal({
  isOpen,
  onClose,
  onSubmit,
  categorias,
  isSubmitting,
  initialData,
}: OtroGastoModalProps) {
  const [formData, setFormData] = useState<CrearOtroGastoDTO>({
    concepto: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    sede: 1,
    idCategoriaGasto: '',
    proveedor: '',
    descripcion: '',
    urlFactura: '',
    numeroFactura: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        concepto: '',
        monto: 0,
        fecha: new Date().toISOString().split('T')[0],
        sede: 1,
        idCategoriaGasto: '',
        proveedor: '',
        descripcion: '',
        urlFactura: '',
        numeroFactura: '',
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.concepto.trim()) {
      newErrors.concepto = 'El concepto es requerido'
    }

    if (formData.monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0'
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error al guardar gasto:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 bg-[rgba(26,26,26,0.98)] rounded-2xl shadow-2xl w-full max-w-2xl border border-[rgba(64,64,64,0.3)] overflow-hidden">
        {/* Header */}
        <div className="bg-[rgba(26,26,26,0.98)] border-b border-[rgba(64,64,64,0.3)] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#f9fafb]">
              {initialData ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
            </h2>
            <p className="text-sm text-[#9ca3af] mt-1">
              Registra gastos operativos como arriendo, servicios, mantenimiento
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgba(64,64,64,0.3)] rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-[#9ca3af]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Concepto */}
          <div>
            <label className="block text-sm font-medium text-[#f9fafb] mb-2">
              Concepto <span className="text-[#c93448]">*</span>
            </label>
            <input
              type="text"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              className="w-full px-4 py-2.5 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent"
              placeholder="Ej: Arriendo Febrero 2026"
              disabled={isSubmitting}
            />
            {errors.concepto && (
              <p className="text-[#ef4444] text-xs mt-1">{errors.concepto}</p>
            )}
          </div>

          {/* Monto y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                Monto <span className="text-[#c93448]">*</span>
              </label>
              <input
                type="number"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent"
                placeholder="0"
                min="0"
                step="1000"
                disabled={isSubmitting}
              />
              {errors.monto && (
                <p className="text-[#ef4444] text-xs mt-1">{errors.monto}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                Fecha <span className="text-[#c93448]">*</span>
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-2.5 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.fecha && (
                <p className="text-[#ef4444] text-xs mt-1">{errors.fecha}</p>
              )}
            </div>
          </div>

          {/* Sede y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                Sede <span className="text-[#c93448]">*</span>
              </label>
              <select
                value={formData.sede}
                onChange={(e) => setFormData({ ...formData, sede: Number(e.target.value) as Sede })}
                className="w-full px-4 py-2.5 bg-[rgba(26,26,26,0.95)] border-2 border-[rgba(255,255,255,0.4)] rounded-lg text-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent [&>option]:bg-[rgba(40,40,40,0.95)] [&>option]:py-2"
                disabled={isSubmitting}
              >
                <option value={1}>{SEDE_LABELS[1]}</option>
                <option value={2}>{SEDE_LABELS[2]}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                Categoría
              </label>
              <select
                value={formData.idCategoriaGasto}
                onChange={(e) => setFormData({ ...formData, idCategoriaGasto: e.target.value })}
                className="w-full px-4 py-2.5 bg-[rgba(26,26,26,0.95)] border-2 border-[rgba(255,255,255,0.4)] rounded-lg text-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent [&>option]:bg-[rgba(40,40,40,0.95)] [&>option]:py-2"
                disabled={isSubmitting}
              >
                <option value="">Sin categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Proveedor y Número Factura */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                Proveedor
              </label>
              <input
                type="text"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                className="w-full px-4 py-2.5 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent"
                placeholder="Nombre del proveedor"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                Número de Factura
              </label>
              <input
                type="text"
                value={formData.numeroFactura}
                onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                className="w-full px-4 py-2.5 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent"
                placeholder="FV-0001"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-[#f9fafb] mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2.5 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent resize-none"
              placeholder="Detalles adicionales del gasto..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* URL Factura */}
          <div>
            <label className="block text-sm font-medium text-[#f9fafb] mb-2">
              URL Factura
            </label>
            <input
              type="url"
              value={formData.urlFactura}
              onChange={(e) => setFormData({ ...formData, urlFactura: e.target.value })}
              className="w-full px-4 py-2.5 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] focus:border-transparent"
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[rgba(64,64,64,0.2)] hover:bg-[rgba(64,64,64,0.3)] text-[#f9fafb] rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Registrar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
