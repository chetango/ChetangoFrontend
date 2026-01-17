// ============================================
// ALUMNO SEARCH TABS - CHETANGO ADMIN
// Requirements: 4.1, 4.2, 4.3, 4.4, 4.7, 4.8, 4.9, 4.10, 13.7
// ============================================

import { useState, useEffect, useCallback } from 'react'
import { Search, QrCode, User } from 'lucide-react'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { GlassInput } from '@/design-system/atoms/GlassInput'
import { GlassButton } from '@/design-system/atoms/GlassButton'
import { QRScanner, type QRScannerStatus } from './QRScanner'
import type { AlumnoDTO } from '../types/paymentTypes'

interface AlumnoSearchTabsProps {
  activeTab: 'busqueda' | 'qr'
  searchTerm: string
  filteredAlumnos: AlumnoDTO[]
  alumnos: AlumnoDTO[]
  isLoading?: boolean
  onTabChange: (tab: 'busqueda' | 'qr') => void
  onSearchChange: (term: string) => void
  onSelectAlumno: (idAlumno: string) => void
  onQRScanError?: (error: string) => void
  getInitials: (nombre: string) => string
}

/**
 * Tabs for searching alumno by name/document or QR code
 *
 * Requirements:
 * - 4.1: Display two tabs: "Búsqueda" and "Escanear QR"
 * - 4.2: When "Búsqueda" tab is active, display search input
 * - 4.3: Filter alumnos by nombreCompleto or documentoIdentidad (client-side)
 * - 4.4: Debounce input by 300ms before filtering
 * - 4.7: Activate camera when QR tab is active
 * - 4.8: Display instructions to user
 * - 4.9: Parse idAlumno from QR code and auto-select
 * - 4.10: Show error if alumno not found
 * - 13.7: Handle camera permission denied
 */
export function AlumnoSearchTabs({
  activeTab,
  searchTerm,
  filteredAlumnos,
  alumnos,
  isLoading = false,
  onTabChange,
  onSearchChange,
  onSelectAlumno,
  onQRScanError,
  getInitials,
}: AlumnoSearchTabsProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm)
  const [qrError, setQrError] = useState<string | null>(null)
  const [qrStatus, setQrStatus] = useState<QRScannerStatus>('idle')

  // Debounce search input by 300ms (Requirement 4.4)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
  }, [])

  /**
   * Handle QR scan result
   * Requirements: 4.9, 4.10
   * - Parse idAlumno from QR code
   * - Auto-select alumno if exists
   * - Show error if alumno not found
   */
  const handleQRScan = useCallback((decodedText: string) => {
    setQrError(null)
    
    // The QR code should contain the idAlumno (GUID)
    // Try to find the alumno by ID
    const alumno = alumnos.find((a) => a.idAlumno === decodedText)
    
    if (alumno) {
      // Alumno found - select and switch to search tab
      onSelectAlumno(alumno.idAlumno)
      onTabChange('busqueda')
    } else {
      // Alumno not found - show error (Requirement 4.10)
      const errorMsg = 'Alumno no encontrado'
      setQrError(errorMsg)
      onQRScanError?.(errorMsg)
    }
  }, [alumnos, onSelectAlumno, onTabChange, onQRScanError])

  /**
   * Handle QR scanner errors
   * Requirement: 13.7
   */
  const handleQRError = useCallback((error: string) => {
    setQrError(error)
    onQRScanError?.(error)
  }, [onQRScanError])

  /**
   * Handle QR scanner status changes
   */
  const handleQRStatusChange = useCallback((status: QRScannerStatus) => {
    setQrStatus(status)
    // Clear error when scanner starts successfully
    if (status === 'scanning') {
      setQrError(null)
    }
  }, [])

  return (
    <GlassPanel className="p-4 mb-4">
      {/* Tab buttons */}
      <div className="flex gap-2 mb-4">
        <GlassButton
          variant={activeTab === 'busqueda' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('busqueda')}
          className="flex-1"
        >
          <Search className="w-4 h-4 mr-2" />
          Búsqueda
        </GlassButton>
        <GlassButton
          variant={activeTab === 'qr' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('qr')}
          className="flex-1"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Escanear QR
        </GlassButton>
      </div>

      {/* Search tab content */}
      {activeTab === 'busqueda' && (
        <div>
          <GlassInput
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={localSearch}
            onChange={handleSearchChange}
            className="mb-3"
            aria-label="Buscar alumno"
          />

          {/* Results list */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {isLoading ? (
              <p className="text-[#9ca3af] text-center py-4">Cargando alumnos...</p>
            ) : filteredAlumnos.length === 0 ? (
              <p className="text-[#9ca3af] text-center py-4">
                {localSearch ? 'No se encontraron alumnos' : 'Escribe para buscar'}
              </p>
            ) : (
              filteredAlumnos.slice(0, 10).map((alumno) => (
                <button
                  key={alumno.idAlumno}
                  onClick={() => onSelectAlumno(alumno.idAlumno)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c93448]/50 to-[#7c5af8]/50 flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(alumno.nombreCompleto)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f9fafb] font-medium truncate">
                      {alumno.nombreCompleto}
                    </p>
                    <p className="text-[#9ca3af] text-sm truncate">
                      {alumno.documentoIdentidad}
                    </p>
                  </div>
                  <User className="w-4 h-4 text-[#6b7280]" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* QR tab content - Requirements: 4.7, 4.8, 4.9, 4.10, 13.7 */}
      {activeTab === 'qr' && (
        <div className="py-4">
          <QRScanner
            isActive={activeTab === 'qr'}
            onScan={handleQRScan}
            onError={handleQRError}
            onStatusChange={handleQRStatusChange}
          />
          
          {/* Error message for alumno not found - Requirement 4.10 */}
          {qrError && qrStatus !== 'permission_denied' && qrStatus !== 'error' && (
            <div className="mt-4 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20">
              <p className="text-[#ef4444] text-sm text-center">
                {qrError}
              </p>
            </div>
          )}
        </div>
      )}
    </GlassPanel>
  )
}
