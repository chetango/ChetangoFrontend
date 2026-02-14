// ============================================
// HISTORIAL DE PAGOS DE ALUMNOS - ADMIN
// Sección expandible con tabla de pagos completados
// ============================================

import { Calendar, ChevronDown, ChevronUp, CreditCard, DollarSign, Eye, Search, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Payment } from '../types/payment.types'

interface HistorialPagosAlumnosSectionProps {
  pagos: Payment[]
  isLoading: boolean
  formatCurrency: (amount: number) => string
  onVerDetalle: (payment: Payment) => void
}

export const HistorialPagosAlumnosSection = ({
  pagos,
  isLoading,
  formatCurrency,
  onVerDetalle,
}: HistorialPagosAlumnosSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filtroAlumno, setFiltroAlumno] = useState('')
  const [filtroMetodo, setFiltroMetodo] = useState('')
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroAño, setFiltroAño] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Obtener lista única de alumnos para el filtro
  const alumnosUnicos = useMemo(() => {
    const nombres = new Set(pagos.map(p => p.nombreAlumno))
    return Array.from(nombres).sort()
  }, [pagos])

  // Obtener métodos de pago únicos
  const metodosUnicos = useMemo(() => {
    const metodos = new Set(pagos.map(p => p.metodoPago))
    return Array.from(metodos).sort()
  }, [pagos])

  // Obtener años únicos para el filtro
  const añosUnicos = useMemo(() => {
    const años = new Set(pagos.map(p => new Date(p.fechaPago).getFullYear()))
    return Array.from(años).sort((a, b) => b - a)
  }, [pagos])

  // Filtrar pagos
  const pagosFiltrados = useMemo(() => {
    return pagos.filter((pago) => {
      const fechaPago = new Date(pago.fechaPago)
      const matchAlumno = filtroAlumno === '' || pago.nombreAlumno === filtroAlumno
      const matchMetodo = filtroMetodo === '' || pago.metodoPago === filtroMetodo
      const matchMes = filtroMes === '' || (fechaPago.getMonth() + 1).toString() === filtroMes
      const matchAño = filtroAño === '' || fechaPago.getFullYear().toString() === filtroAño
      const matchBusqueda = busqueda === '' || 
        pago.nombreAlumno.toLowerCase().includes(busqueda.toLowerCase()) ||
        pago.metodoPago.toLowerCase().includes(busqueda.toLowerCase())

      return matchAlumno && matchMetodo && matchMes && matchAño && matchBusqueda
    }).sort((a, b) => {
      // Ordenar por fecha de pago más reciente primero
      return new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime()
    })
  }, [pagos, filtroAlumno, filtroMetodo, filtroMes, filtroAño, busqueda])

  // Calcular estadísticas de los pagos mostrados
  const estadisticas = useMemo(() => {
    return pagosFiltrados.reduce((acc, pago) => ({
      totalPagos: acc.totalPagos + 1,
      totalMonto: acc.totalMonto + pago.montoTotal,
      promedioMonto: 0, // Se calcula después
    }), {
      totalPagos: 0,
      totalMonto: 0,
      promedioMonto: 0,
    })
  }, [pagosFiltrados])

  // Calcular promedio
  if (estadisticas.totalPagos > 0) {
    estadisticas.promedioMonto = estadisticas.totalMonto / estadisticas.totalPagos
  }

  const limpiarFiltros = () => {
    setFiltroAlumno('')
    setFiltroMetodo('')
    setFiltroMes('')
    setFiltroAño('')
    setBusqueda('')
  }

  const hayFiltrosActivos = filtroAlumno || filtroMetodo || filtroMes || filtroAño || busqueda

  return (
    <div className="mt-8">
      {/* Header con botón expandir/colapsar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-[rgba(26,26,26,0.5)] border border-[rgba(34,197,94,0.3)] rounded-xl hover:bg-[rgba(34,197,94,0.05)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <DollarSign className="text-[#4ade80]" size={24} />
          <div className="text-left">
            <h2 className="text-[#f9fafb] text-xl font-bold">
              Historial de Pagos de Alumnos
            </h2>
            <p className="text-[#9ca3af] text-sm">
              {pagos.length} pago{pagos.length !== 1 ? 's' : ''} registrado{pagos.length !== 1 ? 's' : ''}
              {pagosFiltrados.length !== pagos.length && ` (${pagosFiltrados.length} mostrado${pagosFiltrados.length !== 1 ? 's' : ''})`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-[rgba(34,197,94,0.15)] text-[#4ade80] px-3 py-1 rounded-full text-sm font-medium">
            {formatCurrency(estadisticas.totalMonto)}
          </span>
          {isExpanded ? (
            <ChevronUp className="text-[#4ade80]" size={24} />
          ) : (
            <ChevronDown className="text-[#4ade80]" size={24} />
          )}
        </div>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="mt-4 bg-[rgba(26,26,26,0.5)] border border-[rgba(34,197,94,0.3)] rounded-xl overflow-hidden">
          {/* Filtros */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(26,26,26,0.7)]">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <input
                  type="text"
                  placeholder="Buscar alumno o método..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] placeholder:text-[#6b7280] focus:border-[#4ade80] focus:outline-none transition-colors"
                />
              </div>

              {/* Filtro por Alumno */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <select
                  value={filtroAlumno}
                  onChange={(e) => setFiltroAlumno(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#4ade80] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Todos los alumnos</option>
                  {alumnosUnicos.map((nombre) => (
                    <option key={nombre} value={nombre}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Método de Pago */}
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <select
                  value={filtroMetodo}
                  onChange={(e) => setFiltroMetodo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#4ade80] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Todos los métodos</option>
                  {metodosUnicos.map((metodo) => (
                    <option key={metodo} value={metodo}>
                      {metodo}
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
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#4ade80] focus:outline-none transition-colors appearance-none cursor-pointer"
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
                  className="w-full pl-10 pr-4 py-2 bg-[rgba(26,26,26,0.5)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#f9fafb] focus:border-[#4ade80] focus:outline-none transition-colors appearance-none cursor-pointer"
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
                  <span className="text-[#9ca3af]">Total: </span>
                  <span className="text-[#4ade80] font-bold">{formatCurrency(estadisticas.totalMonto)}</span>
                </div>
                <div>
                  <span className="text-[#9ca3af]">Promedio: </span>
                  <span className="text-[#f9fafb] font-semibold">{formatCurrency(estadisticas.promedioMonto)}</span>
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
                <div className="w-8 h-8 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin" />
              </div>
            ) : pagosFiltrados.length > 0 ? (
              <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                {pagosFiltrados.map((pago) => (
                  <div
                    key={pago.idPago}
                    className="p-4 hover:bg-[rgba(34,197,94,0.05)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Alumno</p>
                          <p className="text-[#f9fafb] font-semibold">{pago.nombreAlumno}</p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Fecha Pago</p>
                          <p className="text-[#f9fafb] font-semibold">
                            {new Date(pago.fechaPago).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Método</p>
                          <p className="text-[#f9fafb] font-semibold">{pago.metodoPago}</p>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Estado</p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            pago.estado === 'Verificado' 
                              ? 'bg-[rgba(34,197,94,0.15)] text-[#4ade80]'
                              : pago.estado === 'Pendiente'
                              ? 'bg-[rgba(245,158,11,0.15)] text-[#fbbf24]'
                              : 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]'
                          }`}>
                            {pago.estado}
                          </span>
                        </div>
                        <div>
                          <p className="text-[#9ca3af] text-xs mb-1">Monto</p>
                          <p className="text-[#4ade80] font-bold text-lg">{formatCurrency(pago.montoTotal)}</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => onVerDetalle(pago)}
                          className="px-4 py-2 bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.2)] text-[#4ade80] border border-[rgba(34,197,94,0.3)] rounded-lg font-semibold transition-all flex items-center gap-2"
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
                  {hayFiltrosActivos ? 'Intenta ajustar los filtros' : 'Los pagos de alumnos aparecerán aquí'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
