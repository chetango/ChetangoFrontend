// ============================================
// REPORT MODAL COMPONENT - CHETANGO
// Modal for displaying detailed report data
// ============================================

import { GlassButton, GlassPanel } from '@/design-system'
import { useModalScroll } from '@/shared/hooks'
import { Download, FileDown, FileSpreadsheet, X } from 'lucide-react'
import { type ReactNode } from 'react'
import type { ReportType } from '../types/reportTypes'

// ============================================
// TYPES
// ============================================

export interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportType: ReportType
  title: string
  children: ReactNode
  onExportPDF?: () => void
  onExportExcel?: () => void
  isExporting?: boolean
}

// ============================================
// COMPONENT
// ============================================

export function ReportModal({
  isOpen,
  onClose,
  title,
  children,
  onExportPDF,
  onExportExcel,
  isExporting = false,
}: ReportModalProps) {
  const containerRef = useModalScroll(isOpen)

  if (!isOpen) return null

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassPanel className="
        relative z-10 
        w-full max-w-6xl 
        max-h-[90vh]
        flex flex-col
        overflow-hidden
      ">
        {/* Header */}
        <div className="
          flex-shrink-0
          flex items-center justify-between
          p-6 pb-4
          border-b border-white/10
        ">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {title}
            </h2>
            <p className="text-gray-400 text-sm">
              Reporte detallado con métricas y estadísticas
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Buttons */}
            {onExportPDF && (
              <GlassButton
                variant="secondary"
                onClick={onExportPDF}
                disabled={isExporting}
                className="!px-3 !py-2"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </GlassButton>
            )}
            
            {onExportExcel && (
              <GlassButton
                variant="secondary"
                onClick={onExportExcel}
                disabled={isExporting}
                className="!px-3 !py-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </GlassButton>
            )}

            {/* Close Button */}
            <GlassButton
              variant="icon"
              onClick={onClose}
              disabled={isExporting}
              className="!p-2"
            >
              <X className="w-5 h-5" />
            </GlassButton>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer with actions */}
        <div className="
          flex-shrink-0
          flex items-center justify-between
          p-6 pt-4
          border-t border-white/10
          bg-black/20
        ">
          <p className="text-gray-400 text-sm">
            💡 Usa los filtros para ajustar los datos mostrados
          </p>
          
          <div className="flex items-center gap-2">
            {(onExportPDF || onExportExcel) && (
              <GlassButton
                variant="primary"
                onClick={() => {
                  if (onExportPDF) onExportPDF()
                  else if (onExportExcel) onExportExcel()
                }}
                disabled={isExporting}
              >
                <Download className="w-4 h-4" />
                <span>Exportar Reporte</span>
              </GlassButton>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isExporting && (
          <div className="
            absolute inset-0
            bg-black/60 backdrop-blur-sm
            flex items-center justify-center
            rounded-xl
          ">
            <div className="text-center">
              <div className="
                animate-spin rounded-full 
                h-12 w-12 
                border-2 border-white/20 border-t-white
                mx-auto mb-4
              " />
              <p className="text-white font-medium">Generando reporte...</p>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
