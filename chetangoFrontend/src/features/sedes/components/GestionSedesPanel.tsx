// ============================================
// GESTIÓN DE SEDES PANEL
// Panel para que el admin de la academia cree, renombre y desactive sedes.
// Respeta el límite MaxSedes del plan de suscripción.
// ============================================

import { Building2, Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
    useCreateSedeMutation,
    useDeleteSedeMutation,
    useSedesQuery,
    useUpdateSedeMutation,
} from '../../dashboard/api/sedesQueries'
import type { SedeConfig } from '../../dashboard/types/dashboard.types'

// ─── Paleta de colores para las sedes (rotativa) ─────────────────────────────
const SEDE_COLORS = ['#c93448', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

function getSedeColor(index: number): string {
  return SEDE_COLORS[index % SEDE_COLORS.length]
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GestionSedesPanelProps {
  /** Límite máximo de sedes según el plan de suscripción. */
  maxSedes: number
}

// ─── Subcomponente: Fila de sede con edición inline ──────────────────────────

interface SedeRowProps {
  sede:       SedeConfig
  index:      number
  esUnica:    boolean
  onSaved:    () => void
}

function SedeRow({ sede, index, esUnica, onSaved }: SedeRowProps) {
  const [editando,    setEditando]    = useState(false)
  const [nombreEdit,  setNombreEdit]  = useState(sede.nombre)
  const [confirmando, setConfirmando] = useState(false)

  const updateMutation = useUpdateSedeMutation()
  const deleteMutation = useDeleteSedeMutation()

  const handleGuardar = async () => {
    const nombre = nombreEdit.trim()
    if (!nombre) {
      toast.error('El nombre no puede estar vacío.')
      return
    }
    try {
      await updateMutation.mutateAsync({ id: sede.id, nombre, orden: sede.orden })
      toast.success(`Sede "${nombre}" actualizada.`)
      setEditando(false)
      onSaved()
    } catch {
      toast.error('No se pudo actualizar la sede. Intenta de nuevo.')
    }
  }

  const handleCancelarEdicion = () => {
    setNombreEdit(sede.nombre)
    setEditando(false)
  }

  const handleEliminar = async () => {
    try {
      await deleteMutation.mutateAsync(sede.id)
      toast.success(`Sede "${sede.nombre}" desactivada.`)
      setConfirmando(false)
      onSaved()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la sede. Intenta de nuevo.'
      toast.error(message)
      setConfirmando(false)
    }
  }

  const colorSede = getSedeColor(index)
  const isSaving  = updateMutation.isPending || deleteMutation.isPending

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
      {/* Indicador de color */}
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: colorSede }}
      />

      {/* Nombre (modo lectura o edición) */}
      {editando ? (
        <input
          autoFocus
          className="flex-1 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.2)] rounded px-2 py-1 text-sm text-[#f9fafb] outline-none focus:border-[#c93448]"
          value={nombreEdit}
          onChange={e => setNombreEdit(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleGuardar(); if (e.key === 'Escape') handleCancelarEdicion() }}
          maxLength={50}
          disabled={isSaving}
        />
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm text-[#f9fafb] font-medium">{sede.nombre}</span>
          {sede.esDefault && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[rgba(201,52,72,0.15)] text-[#c93448] border border-[rgba(201,52,72,0.3)]">
              Default
            </span>
          )}
        </div>
      )}

      {/* Acciones */}
      {confirmando ? (
        // Confirmación de eliminación
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#9ca3af] mr-1">¿Eliminar?</span>
          <button
            onClick={handleEliminar}
            disabled={isSaving}
            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-[rgba(239,68,68,0.1)] transition-colors disabled:opacity-50"
            title="Confirmar eliminación"
          >
            <Check size={14} />
          </button>
          <button
            onClick={() => setConfirmando(false)}
            disabled={isSaving}
            className="p-1 rounded text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[rgba(255,255,255,0.06)] transition-colors disabled:opacity-50"
            title="Cancelar"
          >
            <X size={14} />
          </button>
        </div>
      ) : editando ? (
        // Acciones de edición
        <div className="flex items-center gap-1">
          <button
            onClick={handleGuardar}
            disabled={isSaving}
            className="p-1 rounded text-emerald-400 hover:text-emerald-300 hover:bg-[rgba(16,185,129,0.1)] transition-colors disabled:opacity-50"
            title="Guardar"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border border-emerald-400 border-t-transparent rounded-full animate-spin block" />
            ) : (
              <Check size={14} />
            )}
          </button>
          <button
            onClick={handleCancelarEdicion}
            disabled={isSaving}
            className="p-1 rounded text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[rgba(255,255,255,0.06)] transition-colors disabled:opacity-50"
            title="Cancelar"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        // Acciones normales
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditando(true)}
            className="p-1 rounded text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            title="Renombrar sede"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setConfirmando(true)}
            disabled={esUnica}
            className="p-1 rounded text-[#9ca3af] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={esUnica ? 'No puedes eliminar la única sede activa' : 'Desactivar sede'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function GestionSedesPanel({ maxSedes }: GestionSedesPanelProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nombreNueva,       setNombreNueva]       = useState('')

  const { data: sedes = [], isLoading, refetch } = useSedesQuery()
  const createMutation = useCreateSedeMutation()

  const sedesActivas  = sedes.length
  const limiteAlcanzado = sedesActivas >= maxSedes
  const maxSedesLabel   = maxSedes === 99999 ? '∞' : String(maxSedes)

  const handleAgregarSede = async () => {
    const nombre = nombreNueva.trim()
    if (!nombre) {
      toast.error('Escribe un nombre para la nueva sede.')
      return
    }
    try {
      await createMutation.mutateAsync({ nombre, orden: sedesActivas + 1 })
      toast.success(`Sede "${nombre}" creada exitosamente.`)
      setNombreNueva('')
      setMostrarFormulario(false)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se pudo crear la sede. Verifica tu plan de suscripción.'
      toast.error(errorMessage)
    }
  }

  const handleCancelarFormulario = () => {
    setNombreNueva('')
    setMostrarFormulario(false)
  }

  return (
    <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#f9fafb] text-lg font-bold flex items-center gap-2">
          <Building2 size={20} className="text-[#c93448]" />
          Gestión de Sedes
        </h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[#9ca3af] border border-[rgba(255,255,255,0.08)]">
          {sedesActivas} / {maxSedesLabel}
        </span>
      </div>

      {/* Lista de sedes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <span className="w-5 h-5 border-2 border-[#c93448] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sedes.length === 0 ? (
        <p className="text-sm text-[#6b7280] py-4 text-center">
          No hay sedes configuradas.
        </p>
      ) : (
        <div className="space-y-2 mb-4">
          {sedes.map((sede, index) => (
            <SedeRow
              key={sede.id}
              sede={sede}
              index={index}
              esUnica={sedes.length <= 1}
              onSaved={() => refetch()}
            />
          ))}
        </div>
      )}

      {/* Formulario para nueva sede */}
      {mostrarFormulario && (
        <div className="flex items-center gap-2 mb-3">
          <input
            autoFocus
            className="flex-1 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.2)] rounded px-3 py-2 text-sm text-[#f9fafb] outline-none focus:border-[#c93448] placeholder:text-[#6b7280]"
            placeholder="Nombre de la nueva sede"
            value={nombreNueva}
            onChange={e => setNombreNueva(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAgregarSede(); if (e.key === 'Escape') handleCancelarFormulario() }}
            maxLength={50}
            disabled={createMutation.isPending}
          />
          <button
            onClick={handleAgregarSede}
            disabled={createMutation.isPending || !nombreNueva.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium bg-[#c93448] text-white hover:bg-[#a82838] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Crear
          </button>
          <button
            onClick={handleCancelarFormulario}
            disabled={createMutation.isPending}
            className="p-2 rounded text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[rgba(255,255,255,0.06)] transition-colors disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Botón agregar sede */}
      {!mostrarFormulario && (
        <button
          onClick={() => setMostrarFormulario(true)}
          disabled={limiteAlcanzado}
          title={
            limiteAlcanzado
              ? `Has alcanzado el límite de ${maxSedesLabel} sede(s) de tu plan. Actualiza tu suscripción para agregar más.`
              : 'Agregar nueva sede'
          }
          className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-[rgba(255,255,255,0.15)] text-sm text-[#9ca3af] hover:border-[rgba(201,52,72,0.5)] hover:text-[#c93448] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[rgba(255,255,255,0.15)] disabled:hover:text-[#9ca3af]"
        >
          <Plus size={15} />
          {limiteAlcanzado ? `Límite alcanzado (${sedesActivas}/${maxSedesLabel})` : 'Agregar sede'}
        </button>
      )}

      {/* Nota informativa cuando el límite está cerca */}
      {!limiteAlcanzado && sedesActivas > 0 && maxSedes !== 99999 && (
        <p className="text-[11px] text-[#6b7280] mt-3 text-center">
          {maxSedes - sedesActivas} sede(s) disponible(s) en tu plan.
        </p>
      )}
    </div>
  )
}
