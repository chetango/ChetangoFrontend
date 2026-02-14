// ============================================
// PAYROLL DASHBOARD - ADMIN
// ============================================

import { AlertCircle, CheckCircle, Clock, DollarSign, Trash2, Users, Wallet } from 'lucide-react'
import { useState } from 'react'
import {
    useAprobarPagoMutation,
    useClasesRealizadasQuery,
    useEliminarLiquidacionMutation,
    useLiquidacionesPorEstadoQuery,
    useLiquidarMesMutation,
    useRegistrarPagoMutation,
    useResumenProfesoresQuery,
} from '../../features/payroll'
import { AprobarPagoModal, DetalleProfesorModal, HistorialPagoModal, HistorialPagosSection, LiquidarMesModal, RegistrarPagoModal } from '../../features/payroll/components'
import type { ProfesorClase } from '../../features/payroll/types/payroll.types'
import { ClickableAvatar } from '../../features/users'

interface AprobacionData {
  profesor: ProfesorClase
  claseNombre: string
  claseFecha: string
}

interface RegistroPagoData {
  idLiquidacion: string
  nombreProfesor: string
  mes: number
  año: number
  totalPagar: number
}

const AdminPayrollPage = () => {
  const [aprobacionModal, setAprobacionModal] = useState<AprobacionData | null>(null)
  const [liquidarMesModalOpen, setLiquidarMesModalOpen] = useState(false)
  const [registroPagoModal, setRegistroPagoModal] = useState<RegistroPagoData | null>(null)
  const [detalleProfesorModal, setDetalleProfesorModal] = useState<{
    idProfesor: string
    nombreProfesor: string
  } | null>(null)
  const [historialPagoModal, setHistorialPagoModal] = useState<{
    idLiquidacion: string
    nombreProfesor: string
    periodo: string
    fechaPago: string
  } | null>(null)

  const { data: clasesRealizadas, isLoading: loadingClases } = useClasesRealizadasQuery({
    estadoPago: 'Pendiente',
  })
  
  const { data: clasesAprobadas, isLoading: loadingAprobadas } = useClasesRealizadasQuery({
    estadoPago: 'Aprobado',
  })
  
  const { data: resumen, isLoading: loadingResumen } = useResumenProfesoresQuery()
  const { data: liquidacionesCerradas, isLoading: loadingLiquidaciones } = useLiquidacionesPorEstadoQuery('Cerrada')
  const { data: liquidacionesPagadas, isLoading: loadingLiquidacionesPagadas } = useLiquidacionesPorEstadoQuery('Pagada')
  
  const aprobarPagoMutation = useAprobarPagoMutation()
  const liquidarMesMutation = useLiquidarMesMutation()
  const registrarPagoMutation = useRegistrarPagoMutation()
  const eliminarLiquidacionMutation = useEliminarLiquidacionMutation()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Calcular estadísticas globales
  const stats = resumen?.reduce(
    (acc, prof) => ({
      totalPendientes: acc.totalPendientes + prof.clasesPendientes,
      totalAprobados: acc.totalAprobados + prof.clasesAprobadas,
      totalLiquidados: acc.totalLiquidados + prof.clasesLiquidadas,
      montoPendiente: acc.montoPendiente + prof.totalPendiente,
      montoAprobado: acc.montoAprobado + prof.totalAprobado,
      montoLiquidado: acc.montoLiquidado + prof.totalLiquidado,
    }),
    {
      totalPendientes: 0,
      totalAprobados: 0,
      totalLiquidados: 0,
      montoPendiente: 0,
      montoAprobado: 0,
      montoLiquidado: 0,
    }
  )

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#f9fafb] text-3xl font-bold mb-2">💼 Nómina de Profesores</h1>
            <p className="text-[#9ca3af]">Gestiona los pagos a profesores por clases dictadas</p>
          </div>
          <button
            onClick={() => setLiquidarMesModalOpen(true)}
            disabled={!resumen || resumen.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-[#60a5fa] hover:bg-[#3b82f6] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DollarSign size={20} />
            Liquidar Mes
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(245,158,11,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Clases Pendientes</span>
                <Clock className="text-[#fbbf24]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{stats.totalPendientes}</p>
              <p className="text-[#fbbf24] text-xs mt-1">
                {formatCurrency(stats.montoPendiente)} por aprobar
              </p>
            </div>

            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Clases Aprobadas</span>
                <CheckCircle className="text-[#4ade80]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{stats.totalAprobados}</p>
              <p className="text-[#4ade80] text-xs mt-1">
                {formatCurrency(stats.montoAprobado)} listo para liquidar
              </p>
            </div>

            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(59,130,246,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Liquidadas</span>
                <DollarSign className="text-[#60a5fa]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{stats.totalLiquidados}</p>
              <p className="text-[#60a5fa] text-xs mt-1">
                {formatCurrency(stats.montoLiquidado)} en proceso de pago
              </p>
            </div>

            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(139,92,246,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Total Profesores</span>
                <Users className="text-[#a78bfa]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{resumen?.length || 0}</p>
              <p className="text-[#a78bfa] text-xs mt-1">
                Con clases activas
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Clases Pendientes */}
        <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(245,158,11,0.3)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-[#fbbf24]" size={20} />
            <h2 className="text-[#f9fafb] text-lg font-semibold">Clases Pendientes</h2>
            <span className="ml-auto bg-[rgba(245,158,11,0.15)] text-[#fbbf24] px-2 py-1 rounded-full text-sm font-medium">
              {clasesRealizadas?.reduce((sum, clase) => sum + clase.profesores.length, 0) || 0}
            </span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {loadingClases ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#fbbf24]/30 border-t-[#fbbf24] rounded-full animate-spin" />
              </div>
            ) : clasesRealizadas && clasesRealizadas.length > 0 ? (
              clasesRealizadas.map((clase) => (
                <div key={clase.idClase} className="bg-[rgba(26,26,26,0.7)] border border-[rgba(245,158,11,0.2)] rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-[#f9fafb] font-medium">{clase.nombreClase}</h3>
                      <p className="text-[#9ca3af] text-sm">
                        {new Date(clase.fechaClase).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="text-xs bg-[rgba(245,158,11,0.15)] text-[#fbbf24] px-2 py-1 rounded-full">
                      {clase.tipoClase}
                    </span>
                  </div>
                  {clase.profesores.map((prof) => (
                    <div key={prof.idProfesor} className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)]">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[#f9fafb] text-sm">{prof.nombreProfesor}</p>
                          <p className="text-[#9ca3af] text-xs">{prof.rolEnClase}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#f9fafb] font-medium">{formatCurrency(prof.totalPago)}</p>
                          <button 
                            onClick={() => {
                              if (prof.idClaseProfesor) {
                                setAprobacionModal({
                                  profesor: prof,
                                  claseNombre: clase.nombreClase,
                                  claseFecha: new Date(clase.fechaClase).toLocaleDateString('es-CO', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  }),
                                })
                              }
                            }}
                            className="text-[#fbbf24] text-xs hover:text-[#f59e0b] transition-colors"
                          >
                            Aprobar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-[#6b7280] mb-3" size={48} />
                <p className="text-[#9ca3af]">No hay clases pendientes</p>
                <p className="text-[#6b7280] text-sm mt-1">Las clases por aprobar aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Clases Aprobadas */}
        <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(34,197,94,0.3)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-[#4ade80]" size={20} />
            <h2 className="text-[#f9fafb] text-lg font-semibold">Clases Aprobadas</h2>
            <span className="ml-auto bg-[rgba(34,197,94,0.15)] text-[#4ade80] px-2 py-1 rounded-full text-sm font-medium">
              {clasesAprobadas?.reduce((sum, clase) => sum + clase.profesores.length, 0) || 0}
            </span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {loadingAprobadas ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin" />
              </div>
            ) : clasesAprobadas && clasesAprobadas.length > 0 ? (
              clasesAprobadas.map((clase) => (
                <div key={clase.idClase} className="bg-[rgba(26,26,26,0.7)] border border-[rgba(34,197,94,0.2)] rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-[#f9fafb] font-medium">{clase.nombreClase}</h3>
                      <p className="text-[#9ca3af] text-sm">
                        {new Date(clase.fechaClase).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="text-xs bg-[rgba(34,197,94,0.15)] text-[#4ade80] px-2 py-1 rounded-full">
                      Aprobado
                    </span>
                  </div>
                  {clase.profesores.map((prof) => (
                    <div key={prof.idProfesor} className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)]">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[#f9fafb] text-sm">{prof.nombreProfesor}</p>
                          <p className="text-[#9ca3af] text-xs">{prof.rolEnClase}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#f9fafb] font-medium">{formatCurrency(prof.totalPago)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-[#6b7280] mb-3" size={48} />
                <p className="text-[#9ca3af]">No hay clases aprobadas</p>
                <p className="text-[#6b7280] text-sm mt-1">Las clases aprobadas aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna 3: Resumen por Profesor */}
        <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(64,64,64,0.3)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-[#9ca3af]" size={20} />
            <h2 className="text-[#f9fafb] text-lg font-semibold">Profesores</h2>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {loadingResumen ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#9ca3af]/30 border-t-[#9ca3af] rounded-full animate-spin" />
              </div>
            ) : resumen && resumen.length > 0 ? (
              resumen.map((prof) => (
                <div key={prof.idProfesor} className="bg-[rgba(26,26,26,0.7)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 hover:border-[rgba(255,255,255,0.2)] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <ClickableAvatar
                        userId={prof.idProfesor}
                        userType="profesor"
                        nombre={prof.nombreProfesor}
                      />
                    </div>
                    <span className="text-xs bg-[rgba(139,92,246,0.15)] text-[#a78bfa] px-2 py-1 rounded-full">
                      {prof.clasesPendientes + prof.clasesAprobadas + prof.clasesLiquidadas} clases
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[#9ca3af]">Pendiente</p>
                      <p className="text-[#fbbf24] font-medium">{formatCurrency(prof.totalPendiente)}</p>
                    </div>
                    <div>
                      <p className="text-[#9ca3af]">Aprobado</p>
                      <p className="text-[#4ade80] font-medium">{formatCurrency(prof.totalAprobado)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDetalleProfesorModal({
                      idProfesor: prof.idProfesor,
                      nombreProfesor: prof.nombreProfesor
                    })}
                    className="w-full mt-2 text-[#60a5fa] text-xs hover:text-[#3b82f6] transition-colors"
                  >
                    Ver detalle →
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto text-[#6b7280] mb-3" size={48} />
                <p className="text-[#9ca3af]">No hay profesores</p>
                <p className="text-[#6b7280] text-sm mt-1">Los profesores con clases aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Liquidaciones Pendientes de Pago */}
      {liquidacionesCerradas && liquidacionesCerradas.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="text-[#60a5fa]" size={24} />
            <h2 className="text-[#f9fafb] text-2xl font-bold">Liquidaciones Pendientes de Pago</h2>
            <span className="ml-auto bg-[rgba(96,165,250,0.15)] text-[#60a5fa] px-3 py-1 rounded-full text-sm font-medium">
              {liquidacionesCerradas.length} pendiente{liquidacionesCerradas.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(96,165,250,0.3)] rounded-xl overflow-hidden">
            {loadingLiquidaciones ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#60a5fa]/30 border-t-[#60a5fa] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                {liquidacionesCerradas.map((liquidacion) => (
                  <div key={liquidacion.idLiquidacion} className="p-4 hover:bg-[rgba(96,165,250,0.05)] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Profesor</p>
                          <p className="text-white font-semibold">{liquidacion.nombreProfesor}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Periodo</p>
                          <p className="text-white font-semibold">
                            {new Date(0, liquidacion.mes - 1).toLocaleString('es-CO', { month: 'long' }).charAt(0).toUpperCase() + 
                             new Date(0, liquidacion.mes - 1).toLocaleString('es-CO', { month: 'long' }).slice(1)} {liquidacion.año}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Clases</p>
                          <p className="text-white font-semibold">{liquidacion.totalClases}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Horas</p>
                          <p className="text-white font-semibold">{liquidacion.totalHoras.toFixed(1)}h</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Monto a Pagar</p>
                          <p className="text-[#4ade80] font-bold text-lg">{formatCurrency(liquidacion.totalPagar)}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de eliminar esta liquidación? Las clases volverán al estado "Aprobado".')) {
                              eliminarLiquidacionMutation.mutate(liquidacion.idLiquidacion)
                            }
                          }}
                          className="px-4 py-2 bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] rounded-lg font-semibold transition-all flex items-center gap-2"
                          title="Eliminar liquidación"
                        >
                          <Trash2 size={18} />
                          Eliminar
                        </button>
                        <button
                          onClick={() => setRegistroPagoModal({
                            idLiquidacion: liquidacion.idLiquidacion,
                            nombreProfesor: liquidacion.nombreProfesor,
                            mes: liquidacion.mes,
                            año: liquidacion.año,
                            totalPagar: liquidacion.totalPagar,
                          })}
                          className="px-4 py-2 bg-[#60a5fa] hover:bg-[#3b82f6] text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                          <Wallet size={18} />
                          Registrar Pago
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historial de Pagos Realizados */}
      <HistorialPagosSection
        liquidaciones={liquidacionesPagadas || []}
        isLoading={loadingLiquidacionesPagadas}
        formatCurrency={formatCurrency}
        onVerDetalle={(idLiquidacion, nombreProfesor, periodo, fechaPago) => {
          setHistorialPagoModal({
            idLiquidacion,
            nombreProfesor,
            periodo,
            fechaPago,
          })
        }}
      />

      {/* Modal de Aprobación */}
      <AprobarPagoModal
        isOpen={aprobacionModal !== null}
        onClose={() => setAprobacionModal(null)}
        profesor={aprobacionModal?.profesor ?? null}
        claseNombre={aprobacionModal?.claseNombre ?? ''}
        claseFecha={aprobacionModal?.claseFecha ?? ''}
        onAprobar={(valorAdicional, conceptoAdicional) => {
          if (aprobacionModal?.profesor.idClaseProfesor) {
            aprobarPagoMutation.mutate(
              { 
                idClaseProfesor: aprobacionModal.profesor.idClaseProfesor,
                valorAdicional,
                conceptoAdicional,
              },
              {
                onSuccess: () => {
                  setAprobacionModal(null)
                },
              }
            )
          }
        }}
        isLoading={aprobarPagoMutation.isPending}
      />

      {/* Modal de Liquidar Mes */}
      <LiquidarMesModal
        isOpen={liquidarMesModalOpen}
        onClose={() => setLiquidarMesModalOpen(false)}
        profesores={resumen ?? []}
        onLiquidar={async (mes, año, observaciones) => {
          // Liquidar todos los profesores con clases aprobadas
          const profesoresConAprobadas = (resumen ?? []).filter(p => p.clasesAprobadas > 0)
          
          // Ejecutar todas las liquidaciones en paralelo
          const promesas = profesoresConAprobadas.map((profesor) =>
            liquidarMesMutation.mutateAsync({
              idProfesor: profesor.idProfesor,
              mes,
              año,
              observaciones,
            })
          )

          try {
            await Promise.all(promesas)
            setLiquidarMesModalOpen(false)
          } catch (error) {
            // Los errores individuales ya son manejados por la mutación
            console.error('Error al liquidar:', error)
          }
        }}
        isLoading={liquidarMesMutation.isPending}
      />

      {/* Modal de Registrar Pago */}
      <RegistrarPagoModal
        isOpen={registroPagoModal !== null}
        onClose={() => setRegistroPagoModal(null)}
        liquidacion={registroPagoModal}
        onRegistrar={(fechaPago, observaciones) => {
          if (registroPagoModal) {
            registrarPagoMutation.mutate(
              {
                idLiquidacion: registroPagoModal.idLiquidacion,
                fechaPago,
                observaciones,
              },
              {
                onSuccess: () => {
                  setRegistroPagoModal(null)
                },
              }
            )
          }
        }}
        isLoading={registrarPagoMutation.isPending}
      />

      {/* Modal de Detalle del Profesor */}
      <DetalleProfesorModal
        isOpen={detalleProfesorModal !== null}
        onClose={() => setDetalleProfesorModal(null)}
        idProfesor={detalleProfesorModal?.idProfesor ?? ''}
        nombreProfesor={detalleProfesorModal?.nombreProfesor ?? ''}
      />

      {/* Modal de Detalle del Historial de Pago */}
      <HistorialPagoModal
        isOpen={historialPagoModal !== null}
        onClose={() => setHistorialPagoModal(null)}
        idLiquidacion={historialPagoModal?.idLiquidacion ?? null}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}

export default AdminPayrollPage

