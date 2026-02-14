// ============================================
// HISTORIAL DE PAGOS REALIZADOS - NÓMINA
// Sección expandible con tabla de pagos completados
// ============================================

import { Calendar, ChevronDown, ChevronUp, DollarSign, Eye, Search, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { LiquidacionMensual } from '../types/payroll.types'

interface HistorialPagosSectionProps {
  liquidaciones: LiquidacionMensual[]
  isLoading: boolean
  formatCurrency: (amount: number) => string
  onVerDetalle: (idLiquidacion: string, nombreProfesor: string, periodo: string, fechaPago: string) => void
}

export const HistorialPagosSection = ({
  liquidaciones,
  isLoading,
  formatCurrency,
  onVerDetalle,
}: HistorialPagosSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filtroProfesor, setFiltroProfesor] = useState('')
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroAño, setFiltroAño] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Obtener lista única de profesores para el filtro
  const profesoresUnicos = useMemo(() => {
    const nombres = new Set(liquidaciones.map(l => l.nombreProfesor))
    return Array.from(nombres).sort()
  }, [liquidaciones])

  // Obtener años únicos para el filtro
  const añosUnicos = useMemo(() => {
    const años = new Set(liquidaciones.map(l => l.año))
    return Array.from(años).sort((a, b) => b - a)
  }, [liquidaciones])

  // Filtrar liquidaciones
  const liquidacionesFiltradas = useMemo(() => {
    return liquidaciones.filter((liq) => {
      const matchProfesor = filtroProfesor === '' || liq.nombreProfesor === filtroProfesor
      const matchMes = filtroMes === '' || liq.mes.toString() === filtroMes
      const matchAño = filtroAño === '' || liq.año.toString() === filtroAño
      const matchBusqueda = busqueda === '' || 
        liq.nombreProfesor.toLowerCase().includes(busqueda.toLowerCase())

      return matchProfesor && matchMes && matchAño && matchBusqueda
    }).sort((a, b) => {
      // Ordenar por fecha de pago más reciente primero
      if (a.fechaPago && b.fechaPago) {
        return new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime()
      }
      return 0
    })
  }, [liquidaciones, filtroProfesor, filtroMes, filtroAño, busqueda])

  // Calcular estadísticas de los pagos mostrados
  const estadisticas = useMemo(() => {
    return liquidacionesFiltradas.reduce((acc, liq) => ({
      totalPagos: acc.totalPagos + 1,
      totalMonto: acc.totalMonto + liq.totalPagar,
      totalClases: acc.totalClases + liq.totalClases,
      totalHoras: acc.totalHoras + liq.totalHoras,
    }), {
      totalPagos: 0,
      totalMonto: 0,
      totalClases: 0,
      totalHoras: 0,
    })
  }, [liquidacionesFiltradas])

  const limpiarFiltros = () => {
    setFiltroProfesor('')
    setFiltroMes('')
    setFiltroAño('')
    setBusqueda('')
  }

  const hayFiltrosActivos = filtroProfesor || filtroMes || filtroAño || busqueda

  return (
    <div className="mt-8">
      {/* Header con botón expandir/colapsar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-[rgba(26,26,26,0.5)] border border-[rgba(139,92,246,0.3)] rounded-xl hover:bg-[rgba(139,92,246,0.05)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <DollarSign className="text-[#a78bfa]" size={24} />
          <div className="text-left">
            <h2 className="text-[#f9fafb] text-xl font-bold">
              Historial de Pagos Realizados
            </h2>
            <p className="text-[#9ca3af] text-sm">
              {liquidaciones.length} pago{liquidaciones.length !== 1 ? 's' : ''} registrado{liquidaciones.length !== 1 ? 's' : ''}
              {liquidacionesFiltradas.length !== liquidaciones.length && ` (${liquidacionesFiltradas.length} mostrado${liquidacionesFiltradas.length !== 1 ? 's' : ''})`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-[rgba(139,92,246,0.15)] text-[#a78bfa] px-3 py-1 rounded-full text-sm font-medium">
            {formatCurrency(estadisticas.totalMonto)}
          </span>
          {isExpanded ? (
            <ChevronUp className="text-[#a78bfa]" size={24} />
          ) : (
            <ChevronDown className="text-[#a78bfa]" size={24} />
          )}
        </div>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="mt-4 bg-[rgba(26,26,26,0.5)] border border-[rgba(139,92,246,0.3)] rounded-xl overflow-hidden">
          {/* Filtros */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(26,26,26,0.7)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <input
                  type="text"
                  placeholder="Buscar profesor..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] placeholder:text-[#6b7280] focus:border-[#a78bfa] focus:outline-none transition-colors"
                />
              </div>

              {/* Filtro por Profesor */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <select
                  value={filtroProfesor}
                  onChange={(e) => setFiltroProfesor(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#a78bfa] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Todos los profesores</option>
                  {profesoresUnicos.map((nombre) => (
                    <option key={nombre} value={nombre}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Mes */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <select
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#a78bfa] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Todos los meses</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                    <option key={mes} value={mes.toString()}>
                      {new Date(0, mes - 1).toLocaleString('es-CO', { month: 'long' }).charAt(0).toUpperCase() + 
                       new Date(0, mes - 1).toLocaleString('es-CO', { month: 'long' }).slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Año */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <select
                  value={filtroAño}
                  onChange={(e) => setFiltroAño(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#a78bfa] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Todos los años</option>
                  {añosUnicos.map((año) => (
                    <option key={año} value={año.toString()}>
                      {año}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón limpiar filtros y estadísticas */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-[#9ca3af]">Pagos: </span>
                  <span className="text-[#f9fafb] font-semibold">{estadisticas.totalPagos}</span>
                </div>
                <div>
                  <span className="text-[#9ca3af]">Clases: </span>
                  <span className="text-[#f9fafb] font-semibold">{estadisticas.totalClases}</span>
                </div>
                <div>
                  <span className="text-[#9ca3af]">Horas: </span>
                  <span className="text-[#f9fafb] font-semibold">{estadisticas.totalHoras.toFixed(1)}h</span>
                </div>
                <div>
                  <span className="text-[#9ca3af]">Total: </span>
                  <span className="text-[#a78bfa] font-bold">{formatCurrency(estadisticas.totalMonto)}</span>
                </div>
              </div>

              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="px-3 py-1 text-[#9ca3af] hover:text-[#f9fafb] text-sm transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Tabla de pagos */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#a78bfa]/30 border-t-[#a78bfa] rounded-full animate-spin" />
              </div>
            ) : liquidacionesFiltradas.length > 0 ? (
              <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                {liquidacionesFiltradas.map((liquidacion) => (
                  <div
                    key={liquidacion.idLiquidacion}
                    className="p-4 hover:bg-[rgba(139,92,246,0.05)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Profesor</p>
                          <p className="text-[#f9fafb] font-semibold">{liquidacion.nombreProfesor}</p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Periodo</p>
                          <p className="text-[#f9fafb] font-semibold">
                            {new Date(0, liquidacion.mes - 1).toLocaleString('es-CO', { month: 'short' }).charAt(0).toUpperCase() + 
                             new Date(0, liquidacion.mes - 1).toLocaleString('es-CO', { month: 'short' }).slice(1)} {liquidacion.año}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Fecha Pago</p>
                          <p className="text-[#f9fafb] font-semibold">
                            {liquidacion.fechaPago
                              ? new Date(liquidacion.fechaPago).toLocaleDateString('es-CO', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Clases</p>
                          <p className="text-[#f9fafb] font-semibold">{liquidacion.totalClases}</p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Horas</p>
                          <p className="text-[#f9fafb] font-semibold">{liquidacion.totalHoras.toFixed(1)}h</p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Monto Pagado</p>
                          <p className="text-[#4ade80] font-bold text-lg">{formatCurrency(liquidacion.totalPagar)}</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => {
                            const mesNombre = new Date(0, liquidacion.mes - 1)
                              .toLocaleString('es-CO', { month: 'long' })
                              .charAt(0)
                              .toUpperCase() +
                              new Date(0, liquidacion.mes - 1)
                                .toLocaleString('es-CO', { month: 'long' })
                                .slice(1)
                            const periodo = `${mesNombre} ${liquidacion.año}`
                            const fechaPago = liquidacion.fechaPago || ''
                            onVerDetalle(liquidacion.idLiquidacion, liquidacion.nombreProfesor, periodo, fechaPago)
                          }}
                          className="px-4 py-2 bg-[rgba(139,92,246,0.1)] hover:bg-[rgba(139,92,246,0.2)] text-[#a78bfa] border border-[rgba(139,92,246,0.3)] rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                          <Eye size={18} />
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-[#6b7280] mb-3" size={48} />
                <p className="text-[#9ca3af]">No se encontraron pagos</p>
                <p className="text-[#6b7280] text-sm mt-1">
                  {hayFiltrosActivos ? 'Intenta ajustar los filtros' : 'Los pagos realizados aparecerán aquí'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
