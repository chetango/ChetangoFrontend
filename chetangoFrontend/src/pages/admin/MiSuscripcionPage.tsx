// ============================================
// MI SUSCRIPCIÓN PAGE - ADMIN
// ============================================

import { AlertCircle, CheckCircle, Clock, CreditCard, FileText, TrendingUp, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { GestionSedesPanel } from '../../features/sedes/components/GestionSedesPanel'
import { useSubirComprobanteMutation } from '../../features/suscripciones/api/suscripcionMutations'
import { useConfiguracionPagoQuery, useEstadoSuscripcionQuery, useHistorialPagosQuery } from '../../features/suscripciones/api/suscripcionQueries'
import { PLANES_SUSCRIPCION, type PlanType, type SubirComprobanteRequest } from '../../features/suscripciones/types/suscripcion.types'

const MiSuscripcionPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    referencia: '',
    metodoPago: 'Transferencia Bancaria',
    monto: 0,
    archivo: null as File | null,
  })

  const { data: estado, isLoading: loadingEstado, refetch: refetchEstado } = useEstadoSuscripcionQuery()
  const { data: configuracionPago, isLoading: loadingConfig } = useConfiguracionPagoQuery()
  const { data: historial, isLoading: loadingHistorial, refetch: refetchHistorial } = useHistorialPagosQuery()
  const subirComprobanteMutation = useSubirComprobanteMutation()

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
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm({ ...uploadForm, archivo: file })
    }
  }

  const handleSubmitComprobante = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadForm.archivo) {
      toast.error('Por favor selecciona un archivo')
      return
    }

    try {
      await subirComprobanteMutation.mutateAsync({
        referencia: uploadForm.referencia,
        metodoPago: uploadForm.metodoPago,
        monto: uploadForm.monto,
        archivo: uploadForm.archivo,
      } as SubirComprobanteRequest)

      setIsUploadModalOpen(false)
      setUploadForm({
        referencia: '',
        metodoPago: 'Transferencia Bancaria',
        monto: 0,
        archivo: null,
      })
      refetchHistorial()
      refetchEstado()
      toast.success('¡Comprobante enviado exitosamente! 🎉', {
        description: 'Tu pago será revisado por nuestro equipo'
      })
    } catch (error) {
      toast.error('Error al enviar el comprobante', {
        description: 'Por favor intenta nuevamente'
      })
    }
  }

  const getEstadoBadge = (estadoValue: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      Activo: { bg: 'bg-green-500/20 border-green-500/50', text: 'text-green-400', icon: CheckCircle },
      Suspendido: { bg: 'bg-yellow-500/20 border-yellow-500/50', text: 'text-yellow-400', icon: AlertCircle },
      Cancelado: { bg: 'bg-red-500/20 border-red-500/50', text: 'text-red-400', icon: AlertCircle },
    }
    const badge = badges[estadoValue] || badges.Activo
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${badge.bg} ${badge.text} text-sm font-medium`}>
        <Icon size={16} />
        {estadoValue}
      </span>
    )
  }

  const getPagoEstadoBadge = (estadoPago: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      Aprobado: { bg: 'bg-green-500/20 border-green-500/50', text: 'text-green-400', icon: CheckCircle },
      Pendiente: { bg: 'bg-yellow-500/20 border-yellow-500/50', text: 'text-yellow-400', icon: Clock },
      Rechazado: { bg: 'bg-red-500/20 border-red-500/50', text: 'text-red-400', icon: AlertCircle },
    }
    const badge = badges[estadoPago] || badges.Pendiente
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${badge.bg} ${badge.text} text-xs font-medium`}>
        <Icon size={14} />
        {estadoPago}
      </span>
    )
  }

  const getPlanInfo = (plan: string) => PLANES_SUSCRIPCION[plan as PlanType] ?? {
    nombre: plan,
    precio: 0,
    maxSedes: 0,
    maxAlumnos: 0,
    maxProfesores: 0,
    maxStorageMB: 0,
    caracteristicas: [],
  }

  if (loadingEstado || loadingConfig) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#9ca3af]">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!estado || !configuracionPago) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] rounded-lg p-4 text-red-400">
          Error al cargar la información de suscripción
        </div>
      </div>
    )
  }

  const planInfo = getPlanInfo(estado.plan as PlanType)

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-[#f9fafb] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">💳 Mi Suscripción</h1>
            <p className="text-[#9ca3af] text-sm sm:text-base">Gestiona tu plan y pagos</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#c93448] hover:bg-[#b02d3c] text-white rounded-lg font-medium transition-all min-h-[44px] text-sm sm:text-base w-full sm:w-auto"
          >
            <Upload size={18} className="sm:w-5 sm:h-5" />
            Subir Comprobante
          </button>
        </div>

        {/* Estado de la Suscripción */}
        <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[#f9fafb] text-xl font-bold mb-2">{estado.nombreAcademia}</h2>
              <p className="text-[#9ca3af] text-sm">Plan {planInfo.nombre}</p>
            </div>
            {getEstadoBadge(estado.estado)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-[#9ca3af] text-sm mb-1">Fecha de Registro</p>
              <p className="text-[#f9fafb] font-medium">{formatDate(estado.fechaRegistro)}</p>
            </div>
            {estado.fechaVencimiento && (
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Fecha de Vencimiento</p>
                <p className="text-[#f9fafb] font-medium">{formatDate(estado.fechaVencimiento)}</p>
                {estado.diasRestantes !== null && (
                  <p className={`text-sm mt-1 ${estado.diasRestantes < 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {estado.diasRestantes} días restantes
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Uso de Recursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Cuotas de Uso */}
        <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
          <h3 className="text-[#f9fafb] text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#c93448]" />
            Uso de Cuotas
          </h3>

          <div className="space-y-4">
            {/* Sedes */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#9ca3af]">Sedes</span>
                <span className="text-[#f9fafb] font-medium">
                  {estado.sedesActuales} / {estado.maxSedes === 99999 ? '∞' : estado.maxSedes}
                </span>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div
                  className="bg-[#c93448] h-2 rounded-full transition-all"
                  style={{ width: `${estado.progresoCuotas.sedes}%` }}
                />
              </div>
            </div>

            {/* Alumnos */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#9ca3af]">Alumnos</span>
                <span className="text-[#f9fafb] font-medium">
                  {estado.alumnosActivos} / {estado.maxAlumnos === 99999 ? '∞' : estado.maxAlumnos}
                </span>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div
                  className="bg-[#4ade80] h-2 rounded-full transition-all"
                  style={{ width: `${estado.progresoCuotas.alumnos}%` }}
                />
              </div>
            </div>

            {/* Profesores */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#9ca3af]">Profesores</span>
                <span className="text-[#f9fafb] font-medium">
                  {estado.profesoresActivos} / {estado.maxProfesores === 99999 ? '∞' : estado.maxProfesores}
                </span>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div
                  className="bg-[#3b82f6] h-2 rounded-full transition-all"
                  style={{ width: `${estado.progresoCuotas.profesores}%` }}
                />
              </div>
            </div>

            {/* Almacenamiento */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#9ca3af]">Almacenamiento</span>
                <span className="text-[#f9fafb] font-medium">
                  {estado.storageMBUsado} MB / {estado.maxStorageMB === 999999 ? '∞' : `${estado.maxStorageMB} MB`}
                </span>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div
                  className="bg-[#fbbf24] h-2 rounded-full transition-all"
                  style={{ width: `${estado.progresoCuotas.storage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información de Pago */}
        <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
          <h3 className="text-[#f9fafb] text-lg font-bold mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-[#c93448]" />
            Información de Pago
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-[#9ca3af] text-sm mb-1">Costo Mensual</p>
              <p className="text-[#f9fafb] text-2xl font-bold">{formatCurrency(planInfo.precio)}</p>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
              <p className="text-[#9ca3af] text-sm mb-3 font-medium">Datos Bancarios para Transferencia</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Banco:</span>
                  <span className="text-[#f9fafb] font-medium">{configuracionPago.banco}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Tipo:</span>
                  <span className="text-[#f9fafb] font-medium">{configuracionPago.tipoCuenta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Número:</span>
                  <span className="text-[#f9fafb] font-medium font-mono">{configuracionPago.numeroCuenta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Titular:</span>
                  <span className="text-[#f9fafb] font-medium">{configuracionPago.titular}</span>
                </div>
                {configuracionPago.nit && (
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">NIT:</span>
                    <span className="text-[#f9fafb] font-medium">{configuracionPago.nit}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[rgba(201,52,72,0.1)] border border-[rgba(201,52,72,0.3)] rounded-lg p-3 mt-4">
              <p className="text-[#f9fafb] text-xs">
                💡 <strong>Importante:</strong> Después de realizar la transferencia, sube tu comprobante usando el botón "Subir Comprobante" para que podamos verificar tu pago.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gestión de Sedes */}
      <div className="mb-8">
        <GestionSedesPanel maxSedes={estado.maxSedes} />
      </div>

      {/* Historial de Pagos */}
      <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
        <h3 className="text-[#f9fafb] text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-[#c93448]" />
          Historial de Pagos
        </h3>

        {loadingHistorial ? (
          <div className="text-center text-[#9ca3af] py-8">Cargando historial...</div>
        ) : !historial || historial.length === 0 ? (
          <div className="text-center text-[#9ca3af] py-8">No hay pagos registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.1)]">
                  <th className="text-left text-[#9ca3af] text-sm font-medium py-3 px-2">Fecha</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium py-3 px-2">Referencia</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium py-3 px-2">Monto</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium py-3 px-2">Método</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium py-3 px-2">Estado</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium py-3 px-2">Observaciones</th>
                  <th className="text-left text-[#9ca3af] text-sm font-medium py-3 px-2">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((pago) => (
                  <tr key={pago.id} className="border-b border-[rgba(255,255,255,0.05)]">
                    <td className="py-3 px-2 text-[#f9fafb] text-sm">{formatDate(pago.fechaPago)}</td>
                    <td className="py-3 px-2 text-[#f9fafb] text-sm font-mono">{pago.referencia}</td>
                    <td className="py-3 px-2 text-[#f9fafb] text-sm font-medium">{formatCurrency(pago.monto)}</td>
                    <td className="py-3 px-2 text-[#9ca3af] text-sm">{pago.metodoPago}</td>
                    <td className="py-3 px-2">{getPagoEstadoBadge(pago.estado)}</td>
                    <td className="py-3 px-2">
                      {pago.observaciones ? (
                        <div className={`text-sm ${pago.estado === 'Rechazado' ? 'text-red-400' : 'text-[#9ca3af]'}`}>
                          {pago.observaciones}
                        </div>
                      ) : (
                        <span className="text-[#6b7280] text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {pago.comprobanteUrl ? (
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5194'}${pago.comprobanteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#c93448] hover:text-[#b02d3c] transition-colors"
                        >
                          <FileText size={16} />
                          <span className="text-sm underline">
                            {pago.nombreArchivo || pago.comprobanteUrl.split('/').pop()}
                          </span>
                        </a>
                      ) : (
                        <span className="text-[#6b7280] text-sm">Sin archivo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Subir Comprobante */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-[#f9fafb] text-xl font-bold mb-4">Subir Comprobante de Pago</h3>
            
            <form onSubmit={handleSubmitComprobante} className="space-y-4">
              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Referencia de Transferencia</label>
                <input
                  type="text"
                  value={uploadForm.referencia}
                  onChange={(e) => setUploadForm({ ...uploadForm, referencia: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-[#f9fafb]"
                  required
                  placeholder="Ej: REF123456"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Monto Pagado</label>
                <input
                  type="number"
                  value={uploadForm.monto}
                  onChange={(e) => setUploadForm({ ...uploadForm, monto: parseFloat(e.target.value) })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-[#f9fafb]"
                  required
                  placeholder={planInfo.precio.toString()}
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Método de Pago</label>
                <select
                  value={uploadForm.metodoPago}
                  onChange={(e) => setUploadForm({ ...uploadForm, metodoPago: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-[#f9fafb]"
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Consignación">Consignación</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Comprobante (PDF, JPG, PNG)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-[#f9fafb] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#c93448] file:text-white file:cursor-pointer"
                  required
                />
                {uploadForm.archivo && (
                  <p className="text-[#9ca3af] text-xs mt-2">
                    Archivo seleccionado: {uploadForm.archivo.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#f9fafb] rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={subirComprobanteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-[#c93448] hover:bg-[#b02d3c] text-white rounded-lg transition-all disabled:opacity-50"
                >
                  {subirComprobanteMutation.isPending ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiSuscripcionPage
