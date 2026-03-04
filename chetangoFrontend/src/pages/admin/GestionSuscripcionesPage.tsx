// ============================================
// GESTIÓN SUSCRIPCIONES PAGE - SUPERADMIN
// ============================================

import { Building2, CheckCircle, Clock, FileText, Plus, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { GlassButton } from '../../design-system/atoms/GlassButton/GlassButton'
import { useAprobarPagoMutation, useRechazarPagoMutation } from '../../features/suscripciones/api/suscripcionMutations'
import { useHistorialPagosAdminQuery, useListarAcademiasQuery, usePagosPendientesAprobacionQuery } from '../../features/suscripciones/api/suscripcionQueries'
import { CrearAcademiaModal } from '../../features/suscripciones/components/CrearAcademiaModal'
import type { PagoSuscripcionDto } from '../../features/suscripciones/types/suscripcion.types'

const GestionSuscripcionesPage = () => {
  const [selectedPago, setSelectedPago] = useState<PagoSuscripcionDto | null>(null)
  const [isAprobarModalOpen, setIsAprobarModalOpen] = useState(false)
  const [isRechazarModalOpen, setIsRechazarModalOpen] = useState(false)
  const [observaciones, setObservaciones] = useState('')
  const [isCrearAcademiaModalOpen, setIsCrearAcademiaModalOpen] = useState(false)

  // Queries
  const { data: pagos, isLoading, refetch } = usePagosPendientesAprobacionQuery(true)
  const { data: academias, isLoading: loadingAcademias, refetch: refetchAcademias } = useListarAcademiasQuery(true)
  
  // Obtener historial de hoy para los contadores
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const mañana = new Date(hoy)
  mañana.setDate(mañana.getDate() + 1)
  
  const { data: aprobadosHoyData } = useHistorialPagosAdminQuery(hoy, mañana, 'Aprobado', true)
  const { data: rechazadosHoyData } = useHistorialPagosAdminQuery(hoy, mañana, 'Rechazado', true)
  
  const aprobarMutation = useAprobarPagoMutation()
  const rechazarMutation = useRechazarPagoMutation()

  // Calcular contadores
  const pagosPendientes = pagos?.length || 0
  const aprobadosHoy = aprobadosHoyData?.length || 0
  const rechazadosHoy = rechazadosHoyData?.length || 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleAprobar = (pago: PagoSuscripcionDto) => {
    setSelectedPago(pago)
    setObservaciones('')
    setIsAprobarModalOpen(true)
  }

  const handleRechazar = (pago: PagoSuscripcionDto) => {
    setSelectedPago(pago)
    setObservaciones('')
    setIsRechazarModalOpen(true)
  }

  const confirmAprobar = async () => {
    if (!selectedPago) return

    try {
      await aprobarMutation.mutateAsync({
        pagoId: selectedPago.id,
        request: { observaciones: observaciones || undefined },
      })
      setIsAprobarModalOpen(false)
      setSelectedPago(null)
      refetch()
      toast.success('¡Pago aprobado exitosamente! ✅', {
        description: 'La academia ya puede acceder a su plan'
      })
    } catch (error) {
      toast.error('Error al aprobar el pago', {
        description: 'Por favor intenta nuevamente'
      })
    }
  }

  const confirmRechazar = async () => {
    if (!selectedPago) return

    if (!observaciones.trim()) {
      toast.warning('Por favor ingresa una razón para el rechazo')
      return
    }

    try {
      await rechazarMutation.mutateAsync({
        pagoId: selectedPago.id,
        request: { motivoRechazo: observaciones },
      })
      setIsRechazarModalOpen(false)
      setSelectedPago(null)
      refetch()
      toast.info('Pago rechazado', {
        description: 'La academia será notificada'
      })
    } catch (error) {
      toast.error('Error al rechazar el pago', {
        description: 'Por favor intenta nuevamente'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#9ca3af]">Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#f9fafb] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            🔐 Gestión de Suscripciones
          </h1>
          <p className="text-[#9ca3af] text-sm sm:text-base">Aprueba o rechaza pagos pendientes</p>
        </div>
        
        {/* Botón Crear Academia */}
        <GlassButton
          variant="primary"
          onClick={() => setIsCrearAcademiaModalOpen(true)}
          icon={<Plus size={18} />}
        >
          Crear Academia
        </GlassButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(251,191,36,0.3)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm">Pagos Pendientes</span>
            <Clock className="text-[#fbbf24]" size={20} />
          </div>
          <p className="text-[#f9fafb] text-2xl font-bold">{pagosPendientes}</p>
        </div>

        <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm">Aprobados Hoy</span>
            <CheckCircle className="text-[#4ade80]" size={20} />
          </div>
          <p className="text-[#f9fafb] text-2xl font-bold">{aprobadosHoy}</p>
        </div>

        <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(220,38,38,0.3)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm">Rechazados Hoy</span>
            <XCircle className="text-[#f87171]" size={20} />
          </div>
          <p className="text-[#f9fafb] text-2xl font-bold">{rechazadosHoy}</p>
        </div>
      </div>

      {/* Lista de Pagos Pendientes */}
      <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
        <h3 className="text-[#f9fafb] text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-[#c93448]" />
          Pagos Pendientes de Aprobación
        </h3>

        {!pagos || pagos.length === 0 ? (
          <div className="text-center text-[#9ca3af] py-8">
            <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p>No hay pagos pendientes de aprobación</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pagos.map((pago) => (
              <div
                key={pago.id}
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Info del Pago */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border bg-yellow-500/20 border-yellow-500/50 text-yellow-400 text-xs font-medium">
                        <Clock size={14} />
                        Pendiente
                      </span>
                      <span className="text-[#f9fafb] font-medium">Referencia: {pago.referencia}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-[#9ca3af]">Fecha:</span>{' '}
                        <span className="text-[#f9fafb]">{formatDate(pago.fechaPago)}</span>
                      </div>
                      <div>
                        <span className="text-[#9ca3af]">Monto:</span>{' '}
                        <span className="text-[#f9fafb] font-bold">{formatCurrency(pago.monto)}</span>
                      </div>
                      <div>
                        <span className="text-[#9ca3af]">Método:</span>{' '}
                        <span className="text-[#f9fafb]">{pago.metodoPago}</span>
                      </div>
                      {pago.nombreArchivo && (
                        <div>
                          <span className="text-[#9ca3af]">Archivo:</span>{' '}
                          <span className="text-[#f9fafb]">{pago.nombreArchivo}</span>
                        </div>
                      )}
                      {pago.tamanoArchivo && (
                        <div>
                          <span className="text-[#9ca3af]">Tamaño:</span>{' '}
                          <span className="text-[#f9fafb]">{(pago.tamanoArchivo / 1024).toFixed(2)} KB</span>
                        </div>
                      )}
                    </div>

                    {pago.comprobanteUrl && (
                      <div className="mt-3">
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5194'}${pago.comprobanteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#c93448] hover:text-[#b02d3c] text-sm underline"
                        >
                          <FileText size={16} />
                          Ver Comprobante
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 lg:flex-col">
                    <button
                      onClick={() => handleAprobar(pago)}
                      disabled={aprobarMutation.isPending}
                      className="flex-1 lg:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 min-w-[120px]"
                    >
                      ✓ Aprobar
                    </button>
                    <button
                      onClick={() => handleRechazar(pago)}
                      disabled={rechazarMutation.isPending}
                      className="flex-1 lg:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 min-w-[120px]"
                    >
                      ✗ Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Aprobar Pago */}
      {isAprobarModalOpen && selectedPago && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={24} className="text-green-400" />
              <h3 className="text-[#f9fafb] text-xl font-bold">Aprobar Pago</h3>
            </div>

            <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4 mb-4">
              <p className="text-[#9ca3af] text-sm mb-2">Referencia: <span className="text-[#f9fafb] font-mono">{selectedPago.referencia}</span></p>
              <p className="text-[#9ca3af] text-sm mb-2">Monto: <span className="text-[#f9fafb] font-bold">{formatCurrency(selectedPago.monto)}</span></p>
              <p className="text-[#9ca3af] text-sm">Método: <span className="text-[#f9fafb]">{selectedPago.metodoPago}</span></p>
            </div>

            <div className="mb-4">
              <label className="block text-[#9ca3af] text-sm mb-2">Observaciones (Opcional)</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-[#f9fafb] resize-none"
                rows={3}
                placeholder="Agregar observaciones sobre la aprobación..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAprobarModalOpen(false)}
                className="flex-1 px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#f9fafb] rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAprobar}
                disabled={aprobarMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {aprobarMutation.isPending ? 'Aprobando...' : 'Confirmar Aprobación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rechazar Pago */}
      {isRechazarModalOpen && selectedPago && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <XCircle size={24} className="text-red-400" />
              <h3 className="text-[#f9fafb] text-xl font-bold">Rechazar Pago</h3>
            </div>

            <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] rounded-lg p-4 mb-4">
              <p className="text-[#9ca3af] text-sm mb-2">Referencia: <span className="text-[#f9fafb] font-mono">{selectedPago.referencia}</span></p>
              <p className="text-[#9ca3af] text-sm mb-2">Monto: <span className="text-[#f9fafb] font-bold">{formatCurrency(selectedPago.monto)}</span></p>
              <p className="text-[#9ca3af] text-sm">Método: <span className="text-[#f9fafb]">{selectedPago.metodoPago}</span></p>
            </div>

            <div className="mb-4">
              <label className="block text-[#9ca3af] text-sm mb-2">Razón del Rechazo <span className="text-red-400">*</span></label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-[#f9fafb] resize-none"
                rows={3}
                placeholder="Explica por qué se rechaza el pago..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsRechazarModalOpen(false)}
                className="flex-1 px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#f9fafb] rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRechazar}
                disabled={rechazarMutation.isPending || !observaciones.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {rechazarMutation.isPending ? 'Rechazando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Academias */}
      <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 mb-8">
        <h3 className="text-[#f9fafb] text-lg font-bold mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-[#c93448]" />
          Academias Registradas ({academias?.length || 0})
        </h3>

        {loadingAcademias ? (
          <div className="text-center text-[#9ca3af] py-8">Cargando academias...</div>
        ) : !academias || academias.length === 0 ? (
          <div className="text-center text-[#9ca3af] py-8">
            <Building2 size={48} className="mx-auto mb-3 opacity-50" />
            <p>No hay academias registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.1)]">
                  <th className="text-left text-[#9ca3af] text-sm font-medium p-3">Nombre</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium p-3">Subdomain</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium p-3">Plan</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium p-3">Estado</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium p-3">Límites</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium p-3">Contacto</th>
                </tr>
              </thead>
              <tbody>
                {academias.map((academia) => (
                  <tr key={academia.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="p-3 text-[#f9fafb] font-medium">{academia.nombre}</td>
                    <td className="p-3">
                      <span className="text-[#c93448] font-mono text-sm">{academia.subdomain}</span>
                      <div className="text-[#9ca3af] text-xs">{academia.dominio}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        academia.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' :
                        academia.plan === 'Pro' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {academia.plan}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        academia.estado === 'Activo' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {academia.estado}
                      </span>
                    </td>
                    <td className="p-3 text-[#9ca3af] text-sm">
                      <div>{academia.maxAlumnos} alumnos</div>
                      <div>{academia.maxProfesores} profesores</div>
                      <div>{academia.maxSedes} sedes</div>
                    </td>
                    <td className="p-3 text-[#9ca3af] text-sm">{academia.emailContacto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Academia */}
      <CrearAcademiaModal
        isOpen={isCrearAcademiaModalOpen}
        onClose={() => setIsCrearAcademiaModalOpen(false)}
        onSuccess={() => {
          // Refrescar lista de academias
          refetch()
          refetchAcademias()
        }}
      />
    </div>
  )
}

export default GestionSuscripcionesPage
