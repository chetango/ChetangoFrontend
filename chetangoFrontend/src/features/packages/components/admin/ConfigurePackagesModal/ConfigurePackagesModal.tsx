// ============================================
// CONFIGURE PACKAGES MODAL - ADMIN
// Modal para gestionar tipos de paquetes (catálogo)
// ============================================

import {
    GlassButton,
    GlassInput,
    GlassPanel,
} from '@/design-system'
import { Edit2, Plus, Save, Trash2, X, XCircle } from 'lucide-react'
import { useState } from 'react'
import {
    useCreateTipoPaqueteMutation,
    useToggleTipoPaqueteActivoMutation,
    useUpdateTipoPaqueteMutation,
} from '../../../api/packageMutations'
import type { TipoPaqueteDTO } from '../../../types/packageTypes'

export interface ConfigurePackagesModalProps {
  isOpen: boolean
  onClose: () => void
  tiposPaquete: TipoPaqueteDTO[]
  isLoading?: boolean
}

interface TipoPaqueteForm {
  idTipoPaquete?: string
  nombre: string
  numeroClases: number
  precio: number
  diasVigencia: number
  descripcion: string
  activo: boolean
}

export function ConfigurePackagesModal({
  isOpen,
  onClose,
  tiposPaquete,
  isLoading = false,
}: ConfigurePackagesModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TipoPaqueteForm>({
    nombre: '',
    numeroClases: 0,
    precio: 0,
    diasVigencia: 30,
    descripcion: '',
    activo: true,
  })

  const createMutation = useCreateTipoPaqueteMutation()
  const updateMutation = useUpdateTipoPaqueteMutation()
  const toggleActivoMutation = useToggleTipoPaqueteActivoMutation()

  if (!isOpen) return null

  const handleEdit = (tipo: TipoPaqueteDTO) => {
    setEditingId(tipo.idTipoPaquete)
    setFormData({
      idTipoPaquete: tipo.idTipoPaquete,
      nombre: tipo.nombre,
      numeroClases: tipo.numeroClases,
      precio: tipo.precio,
      diasVigencia: tipo.diasVigencia,
      descripcion: tipo.descripcion || '',
      activo: tipo.activo,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      nombre: '',
      numeroClases: 0,
      precio: 0,
      diasVigencia: 30,
      descripcion: '',
      activo: true,
    })
  }

  const handleSave = async () => {
    if (editingId === 'new') {
      // Crear nuevo
      await createMutation.mutateAsync({
        nombre: formData.nombre,
        numeroClases: formData.numeroClases,
        precio: formData.precio,
        diasVigencia: formData.diasVigencia,
        descripcion: formData.descripcion,
      })
    } else if (editingId) {
      // Actualizar existente
      await updateMutation.mutateAsync({
        idTipoPaquete: editingId,
        nombre: formData.nombre,
        numeroClases: formData.numeroClases,
        precio: formData.precio,
        diasVigencia: formData.diasVigencia,
        descripcion: formData.descripcion,
      })
    }
    handleCancel()
  }

  const handleToggleActive = async (tipo: TipoPaqueteDTO) => {
    await toggleActivoMutation.mutateAsync(tipo.idTipoPaquete)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending || toggleActivoMutation.isPending

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassPanel className="relative z-10 w-full max-w-4xl flex flex-col max-h-[calc(100vh-6rem)]">
        {/* Header - Fixed */}
        <div className="p-6 pb-4 flex-shrink-0 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Configurar Paquetes</h2>
            <p className="text-sm text-gray-400 mt-1">
              Gestiona los tipos de paquetes disponibles para asignar a alumnos
            </p>
          </div>
          <GlassButton
            variant="icon"
            onClick={onClose}
            className="!p-2"
          >
            <X className="w-5 h-5" />
          </GlassButton>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Tabla de tipos de paquetes */}
          <div className="space-y-4">
          {tiposPaquete.map((tipo) => (
            <div
              key={tipo.idTipoPaquete}
              className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)]"
            >
              {editingId === tipo.idTipoPaquete ? (
                /* Modo edición */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <GlassInput
                      label="Nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                    <GlassInput
                      label="Número de clases"
                      type="number"
                      value={formData.numeroClases}
                      onChange={(e) => setFormData({ ...formData, numeroClases: parseInt(e.target.value) })}
                    />
                    <GlassInput
                      label="Precio"
                      type="number"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                    />
                    <GlassInput
                      label="Días de vigencia"
                      type="number"
                      value={formData.diasVigencia}
                      onChange={(e) => setFormData({ ...formData, diasVigencia: parseInt(e.target.value) })}
                    />
                  </div>
                  <GlassInput
                    label="Descripción"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                  <div className="flex gap-2 justify-end">
                    <GlassButton variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                      <XCircle className="w-4 h-4" />
                      Cancelar
                    </GlassButton>
                    <GlassButton variant="primary" onClick={handleSave} disabled={isSubmitting}>
                      <Save className="w-4 h-4" />
                      Guardar
                    </GlassButton>
                  </div>
                </div>
              ) : (
                /* Modo vista */
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{tipo.nombre}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${tipo.activo ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {tipo.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                      <span>{tipo.numeroClases} clases</span>
                      <span>${tipo.precio.toLocaleString()}</span>
                      <span>{tipo.diasVigencia} días</span>
                    </div>
                    {tipo.descripcion && (
                      <p className="text-sm text-gray-500 mt-2">{tipo.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <GlassButton
                      variant="icon"
                      onClick={() => handleEdit(tipo)}
                      title="Editar"
                      disabled={isSubmitting}
                    >
                      <Edit2 className="w-4 h-4" />
                    </GlassButton>
                    <GlassButton
                      variant="icon"
                      onClick={() => handleToggleActive(tipo)}
                      title={tipo.activo ? 'Desactivar' : 'Activar'}
                      disabled={isSubmitting}
                    >
                      {tipo.activo ? (
                        <Trash2 className="w-4 h-4 text-red-400" />
                      ) : (
                        <Plus className="w-4 h-4 text-green-400" />
                      )}
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botón para agregar nuevo */}
        {editingId === null && (
          <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
            <GlassButton
              variant="secondary"
              onClick={() => setEditingId('new')}
              className="w-full"
            >
              <Plus className="w-4 h-4" />
              Agregar Nuevo Tipo de Paquete
            </GlassButton>
          </div>
        )}

        {/* Formulario para nuevo */}
        {editingId === 'new' && (
          <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
            <h3 className="text-white font-medium mb-4">Nuevo Tipo de Paquete</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="ej: Paquete 10 clases"
                />
                <GlassInput
                  label="Número de clases"
                  type="number"
                  value={formData.numeroClases}
                  onChange={(e) => setFormData({ ...formData, numeroClases: parseInt(e.target.value) })}
                  placeholder="10"
                />
                <GlassInput
                  label="Precio"
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                  placeholder="150000"
                />
                <GlassInput
                  label="Días de vigencia"
                  type="number"
                  value={formData.diasVigencia}
                  onChange={(e) => setFormData({ ...formData, diasVigencia: parseInt(e.target.value) })}
                  placeholder="30"
                />
              </div>
              <GlassInput
                label="Descripción (opcional)"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del paquete..."
              />
              <div className="flex gap-2 justify-end">
                <GlassButton variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                  <XCircle className="w-4 h-4" />
                  Cancelar
                </GlassButton>
                <GlassButton variant="primary" onClick={handleSave} disabled={isSubmitting}>
                  <Save className="w-4 h-4" />
                  Crear Paquete
                </GlassButton>
              </div>
            </div>
          </div>
        )}
        </div>
      </GlassPanel>
    </div>
  )
}
