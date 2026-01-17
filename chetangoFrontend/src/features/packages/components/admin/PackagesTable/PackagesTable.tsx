// ============================================
// PACKAGES TABLE COMPONENT
// ============================================

import { Package, Search } from 'lucide-react'
import {
  GlassTable,
  GlassTableHeader,
  GlassTableBody,
  GlassTableHead,
  GlassTableRow,
  GlassTableCell,
} from '@/design-system/molecules/GlassTable'
import { Skeleton, SkeletonAvatar, SkeletonText } from '@/design-system'
import { PackageTableRow } from '../PackageTableRow'
import type { PaqueteListItemDTO } from '../../../types/packageTypes'

interface PackagesTableProps {
  /** List of packages to display */
  paquetes: PaqueteListItemDTO[]
  /** Whether the data is loading */
  isLoading: boolean
  /** Current search term for empty state message */
  searchTerm: string
  /** Whether any filters are applied */
  hasFilters: boolean
  /** Callback when view detail button is clicked */
  onViewDetail: (idPaquete: string) => void
  /** Callback when congelar button is clicked */
  onCongelar?: (idPaquete: string) => void
  /** Callback when descongelar button is clicked */
  onDescongelar?: (idPaquete: string) => void
  /** Helper function to get initials from name */
  getInitials: (nombre: string) => string
  /** Helper function to calculate consumption percentage */
  getConsumoPercentage: (paquete: PaqueteListItemDTO) => number
}

/**
 * Skeleton row component for loading state
 */
function SkeletonTableRow() {
  return (
    <GlassTableRow>
      {/* ALUMNO column skeleton */}
      <GlassTableCell>
        <div className="flex items-center gap-3">
          <SkeletonAvatar />
          <div className="flex flex-col gap-1">
            <SkeletonText className="w-32" />
            <SkeletonText className="w-24" />
          </div>
        </div>
      </GlassTableCell>
      {/* PAQUETE column skeleton */}
      <GlassTableCell>
        <div className="flex flex-col gap-1">
          <SkeletonText className="w-28" />
          <SkeletonText className="w-20" />
        </div>
      </GlassTableCell>
      {/* CONSUMO column skeleton */}
      <GlassTableCell>
        <div className="flex flex-col gap-2">
          <SkeletonText className="w-16" />
          <Skeleton className="h-2 w-24 rounded-full" />
        </div>
      </GlassTableCell>
      {/* ESTADO column skeleton */}
      <GlassTableCell>
        <Skeleton className="h-7 w-20 rounded-lg" />
      </GlassTableCell>
      {/* VIGENCIA column skeleton */}
      <GlassTableCell>
        <div className="flex flex-col gap-1">
          <SkeletonText className="w-24" />
          <SkeletonText className="w-24" />
        </div>
      </GlassTableCell>
      {/* ACCIONES column skeleton */}
      <GlassTableCell>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </GlassTableCell>
    </GlassTableRow>
  )
}

/**
 * Empty state component when no packages exist or match filters
 */
function EmptyState({
  searchTerm,
  hasFilters,
}: {
  searchTerm: string
  hasFilters: boolean
}) {
  const hasSearch = searchTerm.trim().length > 0

  return (
    <div
      className="
        flex flex-col items-center justify-center
        py-16
        backdrop-blur-xl
        bg-[rgba(26,26,32,0.5)]
        border border-[rgba(255,255,255,0.1)]
        rounded-xl
      "
    >
      {hasSearch || hasFilters ? (
        <>
          <Search className="w-12 h-12 text-[#6b7280] mb-4" />
          <p className="text-[#9ca3af] text-lg">
            No se encontraron paquetes con los filtros aplicados
          </p>
          <p className="text-[#6b7280] text-sm mt-2">
            Intenta con otros criterios de búsqueda
          </p>
        </>
      ) : (
        <>
          <Package className="w-12 h-12 text-[#6b7280] mb-4" />
          <p className="text-[#9ca3af] text-lg">No hay paquetes registrados</p>
          <p className="text-[#6b7280] text-sm mt-2">
            Crea un nuevo paquete para comenzar
          </p>
        </>
      )}
    </div>
  )
}

/**
 * Table component for displaying packages list
 * - Columns: ALUMNO, PAQUETE, CONSUMO, ESTADO, VIGENCIA, ACCIONES
 * - Uses GlassTable from design system
 * - Implements skeleton loader during loading
 * - Implements empty state when no packages
 *
 * Requirements: 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 10.2, 12.1, 12.2
 */
export function PackagesTable({
  paquetes,
  isLoading,
  searchTerm,
  hasFilters,
  onViewDetail,
  onCongelar,
  onDescongelar,
  getInitials,
  getConsumoPercentage,
}: PackagesTableProps) {
  // Show skeleton loader during loading
  if (isLoading) {
    return (
      <GlassTable>
        <GlassTableHeader>
          <GlassTableRow>
            <GlassTableHead>ALUMNO</GlassTableHead>
            <GlassTableHead>PAQUETE</GlassTableHead>
            <GlassTableHead>CONSUMO</GlassTableHead>
            <GlassTableHead>ESTADO</GlassTableHead>
            <GlassTableHead>VIGENCIA</GlassTableHead>
            <GlassTableHead>ACCIONES</GlassTableHead>
          </GlassTableRow>
        </GlassTableHeader>
        <GlassTableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonTableRow key={index} />
          ))}
        </GlassTableBody>
      </GlassTable>
    )
  }

  // Show empty state when no packages
  if (paquetes.length === 0) {
    return <EmptyState searchTerm={searchTerm} hasFilters={hasFilters} />
  }

  return (
    <GlassTable>
      <GlassTableHeader>
        <GlassTableRow>
          <GlassTableHead>ALUMNO</GlassTableHead>
          <GlassTableHead>PAQUETE</GlassTableHead>
          <GlassTableHead>CONSUMO</GlassTableHead>
          <GlassTableHead>ESTADO</GlassTableHead>
          <GlassTableHead>VIGENCIA</GlassTableHead>
          <GlassTableHead>ACCIONES</GlassTableHead>
        </GlassTableRow>
      </GlassTableHeader>
      <GlassTableBody>
        {paquetes.map((paquete) => (
          <PackageTableRow
            key={paquete.idPaquete}
            paquete={paquete}
            onViewDetail={() => onViewDetail(paquete.idPaquete)}
            onCongelar={onCongelar ? () => onCongelar(paquete.idPaquete) : undefined}
            onDescongelar={onDescongelar ? () => onDescongelar(paquete.idPaquete) : undefined}
            getInitials={getInitials}
            getConsumoPercentage={getConsumoPercentage}
          />
        ))}
      </GlassTableBody>
    </GlassTable>
  )
}
