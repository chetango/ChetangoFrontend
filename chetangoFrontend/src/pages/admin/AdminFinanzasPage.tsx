// ============================================
// ADMIN FINANZAS PAGE - GESTIÓN DE INGRESOS Y GASTOS
// ============================================

import {
    useCrearOtroGastoMutation,
    useCrearOtroIngresoMutation,
    useEliminarOtroGastoMutation,
    useEliminarOtroIngresoMutation,
} from '@/features/finanzas/api/finanzasMutations'
import {
    useCategoriasGastoQuery,
    useCategoriasIngresoQuery,
    useOtrosGastosQuery,
    useOtrosIngresosQuery,
} from '@/features/finanzas/api/finanzasQueries'
import { OtroGastoModal } from '@/features/finanzas/components/OtroGastoModal'
import { OtroIngresoModal } from '@/features/finanzas/components/OtroIngresoModal'
import type { CrearOtroGastoDTO, CrearOtroIngresoDTO, OtroGastoDTO, OtroIngresoDTO, Sede } from '@/features/finanzas/types/finanzasTypes'
import { SEDE_LABELS } from '@/features/finanzas/types/finanzasTypes'
import { ConfirmationModal } from '@/shared/components/ConfirmationModal'
import { ArrowDown, ArrowUp, Calendar, DollarSign, Filter, Plus, Trash2, TrendingDown, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'

const AdminFinanzasPage = () => {
  // Estados para filtros
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [sedeFilter, setSedeFilter] = useState<Sede | undefined>(undefined)
  const [categoriaIngresoFilter, setCategoriaIngresoFilter] = useState('')
  const [categoriaGastoFilter, setCategoriaGastoFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Estados para modales
  const [isIngresoModalOpen, setIsIngresoModalOpen] = useState(false)
  const [isGastoModalOpen, setIsGastoModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'ingresos' | 'gastos'>('ingresos')
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean
    id: string
    type: 'ingreso' | 'gasto'
    concepto: string
  }>({ isOpen: false, id: '', type: 'ingreso', concepto: '' })

  // Queries
  const { data: ingresos = [], isLoading: loadingIngresos } = useOtrosIngresosQuery({
    fechaDesde,
    fechaHasta,
    sede: sedeFilter,
    idCategoria: categoriaIngresoFilter,
  })

  const { data: gastos = [], isLoading: loadingGastos } = useOtrosGastosQuery({
    fechaDesde,
    fechaHasta,
    sede: sedeFilter,
    idCategoria: categoriaGastoFilter,
  })

  const { data: categoriasIngreso = [] } = useCategoriasIngresoQuery()
  const { data: categoriasGasto = [] } = useCategoriasGastoQuery()

  // Mutations
  const crearIngresoMutation = useCrearOtroIngresoMutation()
  const crearGastoMutation = useCrearOtroGastoMutation()
  const eliminarIngresoMutation = useEliminarOtroIngresoMutation()
  const eliminarGastoMutation = useEliminarOtroGastoMutation()

  // Cálculos de estadísticas
  const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.monto, 0)
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)
  const balance = totalIngresos - totalGastos

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
      month: 'short',
      day: 'numeric',
    })
  }

  const handleCrearIngreso = async (data: CrearOtroIngresoDTO) => {
    await crearIngresoMutation.mutateAsync(data)
  }

  const handleCrearGasto = async (data: CrearOtroGastoDTO) => {
    await crearGastoMutation.mutateAsync(data)
  }

  const handleEliminarIngreso = (ingreso: OtroIngresoDTO) => {
    setConfirmDelete({
      isOpen: true,
      id: ingreso.idOtroIngreso,
      type: 'ingreso',
      concepto: ingreso.concepto,
    })
  }

  const handleEliminarGasto = (gasto: OtroGastoDTO) => {
    setConfirmDelete({
      isOpen: true,
      id: gasto.idOtroGasto,
      type: 'gasto',
      concepto: gasto.concepto,
    })
  }

  const confirmDeleteAction = async () => {
    if (confirmDelete.type === 'ingreso') {
      await eliminarIngresoMutation.mutateAsync(confirmDelete.id)
    } else {
      await eliminarGastoMutation.mutateAsync(confirmDelete.id)
    }
  }

  const clearFilters = () => {
    setFechaDesde('')
    setFechaHasta('')
    setSedeFilter(undefined)
    setCategoriaIngresoFilter('')
    setCategoriaGastoFilter('')
  }

  const hasActiveFilters = fechaDesde || fechaHasta || sedeFilter !== undefined || categoriaIngresoFilter || categoriaGastoFilter

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-[#f9fafb] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 flex items-center gap-3">
              <TrendingUp className="text-[#22c55e]" size={32} />
              Otros Movimientos
            </h1>
            <p className="text-[#9ca3af] text-sm sm:text-base">
              Administra ingresos y gastos adicionales de la academia
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[rgba(64,64,64,0.2)] hover:bg-[rgba(64,64,64,0.3)] text-[#f9fafb] rounded-lg font-medium transition-colors min-h-[44px]"
            >
              <Filter size={18} />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-[#c93448] text-white text-xs rounded-full">
                  {[fechaDesde, fechaHasta, sedeFilter !== undefined, categoriaIngresoFilter, categoriaGastoFilter].filter(Boolean).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsIngresoModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg font-medium transition-colors min-h-[44px]"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Ingreso</span>
            </button>
            <button
              onClick={() => setIsGastoModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg font-medium transition-colors min-h-[44px]"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Gasto</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full px-3 py-2 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] text-sm focus:outline-none focus:ring-2 focus:ring-[#c93448]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full px-3 py-2 bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg text-[#f9fafb] text-sm focus:outline-none focus:ring-2 focus:ring-[#c93448]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                  Sede
                </label>
                <select
                  value={sedeFilter === undefined ? '' : sedeFilter}
                  onChange={(e) => setSedeFilter(e.target.value === '' ? undefined : Number(e.target.value) as Sede)}
                  className="w-full px-3 py-2 bg-[rgba(26,26,26,0.95)] border-2 border-[rgba(255,255,255,0.4)] rounded-lg text-[#f9fafb] text-sm focus:outline-none focus:ring-2 focus:ring-[#c93448] transition-colors [&>option]:bg-[rgba(40,40,40,0.95)] [&>option]:py-2"
                >
                  <option value="">Todas</option>
                  <option value={1}>{SEDE_LABELS[1]}</option>
                  <option value={2}>{SEDE_LABELS[2]}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f9fafb] mb-2">
                  Categoría
                </label>
                <select
                  value={selectedTab === 'ingresos' ? categoriaIngresoFilter : categoriaGastoFilter}
                  onChange={(e) => {
                    if (selectedTab === 'ingresos') {
                      setCategoriaIngresoFilter(e.target.value)
                    } else {
                      setCategoriaGastoFilter(e.target.value)
                    }
                  }}
                  className="w-full px-3 py-2 bg-[rgba(26,26,26,0.95)] border-2 border-[rgba(255,255,255,0.4)] rounded-lg text-[#f9fafb] text-sm focus:outline-none focus:ring-2 focus:ring-[#c93448] transition-colors [&>option]:bg-[rgba(40,40,40,0.95)] [&>option]:py-2"
                >
                  <option value="">Todas</option>
                  {(selectedTab === 'ingresos' ? categoriasIngreso : categoriasGasto).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
                >
                  <X size={16} />
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-sm">Total Ingresos</span>
              <TrendingUp className="text-[#22c55e]" size={20} />
            </div>
            <p className="text-[#f9fafb] text-2xl font-bold">{formatCurrency(totalIngresos)}</p>
            <p className="text-[#22c55e] text-xs mt-1">{ingresos.length} registros</p>
          </div>

          <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(239,68,68,0.3)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-sm">Total Gastos</span>
              <TrendingDown className="text-[#ef4444]" size={20} />
            </div>
            <p className="text-[#f9fafb] text-2xl font-bold">{formatCurrency(totalGastos)}</p>
            <p className="text-[#ef4444] text-xs mt-1">{gastos.length} registros</p>
          </div>

          <div className={`bg-[rgba(64,64,64,0.2)] border ${balance >= 0 ? 'border-[rgba(34,197,94,0.3)]' : 'border-[rgba(239,68,68,0.3)]'} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-sm">Balance Neto</span>
              <DollarSign className={balance >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'} size={20} />
            </div>
            <p className="text-[#f9fafb] text-2xl font-bold">{formatCurrency(balance)}</p>
            <p className={`text-xs mt-1 ${balance >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {balance >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[rgba(64,64,64,0.3)]">
        <button
          onClick={() => setSelectedTab('ingresos')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'ingresos'
              ? 'text-[#22c55e] border-b-2 border-[#22c55e]'
              : 'text-[#9ca3af] hover:text-[#f9fafb]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowUp size={18} />
            Ingresos ({ingresos.length})
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('gastos')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'gastos'
              ? 'text-[#ef4444] border-b-2 border-[#ef4444]'
              : 'text-[#9ca3af] hover:text-[#f9fafb]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowDown size={18} />
            Gastos ({gastos.length})
          </div>
        </button>
      </div>

      {/* Content */}
      {selectedTab === 'ingresos' ? (
        <IngresosTable
          ingresos={ingresos}
          isLoading={loadingIngresos}
          onDelete={handleEliminarIngreso}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      ) : (
        <GastosTable
          gastos={gastos}
          isLoading={loadingGastos}
          onDelete={handleEliminarGasto}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {/* Modals */}
      <OtroIngresoModal
        isOpen={isIngresoModalOpen}
        onClose={() => setIsIngresoModalOpen(false)}
        onSubmit={handleCrearIngreso}
        categorias={categoriasIngreso}
        isSubmitting={crearIngresoMutation.isPending}
      />

      <OtroGastoModal
        isOpen={isGastoModalOpen}
        onClose={() => setIsGastoModalOpen(false)}
        onSubmit={handleCrearGasto}
        categorias={categoriasGasto}
        isSubmitting={crearGastoMutation.isPending}
      />

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: '', type: 'ingreso', concepto: '' })}
        onConfirm={confirmDeleteAction}
        title="Eliminar Movimiento"
        message={`¿Estás seguro de eliminar el ${confirmDelete.type === 'ingreso' ? 'ingreso' : 'gasto'} "${confirmDelete.concepto}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  )
}

// Componente tabla de ingresos
function IngresosTable({
  ingresos,
  isLoading,
  onDelete,
  formatCurrency,
  formatDate,
}: {
  ingresos: OtroIngresoDTO[]
  isLoading: boolean
  onDelete: (ingreso: OtroIngresoDTO) => void
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
}) {
  if (isLoading) {
    return <div className="text-center text-[#9ca3af] py-8">Cargando...</div>
  }

  if (ingresos.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="mx-auto text-[#6b7280] mb-4" size={48} />
        <p className="text-[#9ca3af] text-lg">No hay ingresos registrados</p>
      </div>
    )
  }

  return (
    <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[rgba(64,64,64,0.3)] border-b border-[rgba(64,64,64,0.3)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Sede
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Monto
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(64,64,64,0.3)]">
            {ingresos.map((ingreso) => (
              <tr key={ingreso.idOtroIngreso} className="hover:bg-[rgba(64,64,64,0.2)]">
                <td className="px-4 py-3 text-sm text-[#f9fafb] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#9ca3af]" />
                    {formatDate(ingreso.fecha)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-[#f9fafb]">{ingreso.concepto}</div>
                  {ingreso.descripcion && (
                    <div className="text-xs text-[#9ca3af] mt-1">{ingreso.descripcion}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#9ca3af]">
                  {ingreso.nombreCategoria || 'Sin categoría'}
                </td>
                <td className="px-4 py-3 text-sm text-[#f9fafb]">
                  <span className="px-2 py-1 bg-[rgba(64,64,64,0.3)] rounded text-xs">
                    {SEDE_LABELS[ingreso.sede]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-[#22c55e] text-right">
                  {formatCurrency(ingreso.monto)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onDelete(ingreso)}
                    className="p-2 text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors"
                    title="Eliminar ingreso"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente tabla de gastos
function GastosTable({
  gastos,
  isLoading,
  onDelete,
  formatCurrency,
  formatDate,
}: {
  gastos: OtroGastoDTO[]
  isLoading: boolean
  onDelete: (gasto: OtroGastoDTO) => void
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
}) {
  if (isLoading) {
    return <div className="text-center text-[#9ca3af] py-8">Cargando...</div>
  }

  if (gastos.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingDown className="mx-auto text-[#6b7280] mb-4" size={48} />
        <p className="text-[#9ca3af] text-lg">No hay gastos registrados</p>
      </div>
    )
  }

  return (
    <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[rgba(64,64,64,0.3)] border-b border-[rgba(64,64,64,0.3)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Sede
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Monto
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(64,64,64,0.3)]">
            {gastos.map((gasto) => (
              <tr key={gasto.idOtroGasto} className="hover:bg-[rgba(64,64,64,0.2)]">
                <td className="px-4 py-3 text-sm text-[#f9fafb] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#9ca3af]" />
                    {formatDate(gasto.fecha)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-[#f9fafb]">{gasto.concepto}</div>
                  {gasto.descripcion && (
                    <div className="text-xs text-[#9ca3af] mt-1">{gasto.descripcion}</div>
                  )}
                  {gasto.numeroFactura && (
                    <div className="text-xs text-[#6b7280] mt-1">Fact: {gasto.numeroFactura}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#9ca3af]">
                  {gasto.nombreCategoria || 'Sin categoría'}
                </td>
                <td className="px-4 py-3 text-sm text-[#9ca3af]">
                  {gasto.proveedor || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-[#f9fafb]">
                  <span className="px-2 py-1 bg-[rgba(64,64,64,0.3)] rounded text-xs">
                    {SEDE_LABELS[gasto.sede]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-[#ef4444] text-right">
                  {formatCurrency(gasto.monto)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onDelete(gasto)}
                    className="p-2 text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors"
                    title="Eliminar gasto"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminFinanzasPage
