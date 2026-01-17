// ============================================
// QR SCANNER COMPONENT - CHETANGO ADMIN
// Requirements: 4.7, 4.8, 4.9, 4.10, 13.7
// ============================================

import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { Camera, CameraOff, AlertCircle, Loader2, QrCode } from 'lucide-react'
import { GlassButton } from '@/design-system/atoms/GlassButton'

// ============================================
// TYPES
// ============================================

export type QRScannerStatus = 
  | 'idle'           // Not started
  | 'initializing'   // Camera is being initialized
  | 'scanning'       // Actively scanning
  | 'permission_denied' // Camera permission denied
  | 'error'          // Other error occurred
  | 'success'        // QR code successfully scanned

export interface QRScannerProps {
  /** Whether the scanner should be active */
  isActive: boolean
  /** Callback when a QR code is successfully scanned */
  onScan: (decodedText: string) => void
  /** Callback when an error occurs */
  onError?: (error: string) => void
  /** Callback when scanner status changes */
  onStatusChange?: (status: QRScannerStatus) => void
}

// ============================================
// CONSTANTS
// ============================================

const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
}

const SCANNER_ELEMENT_ID = 'qr-scanner-reader'

// ============================================
// COMPONENT
// ============================================

/**
 * QR Scanner component using device camera
 * 
 * Requirements:
 * - 4.7: Activate camera when QR tab is active
 * - 4.8: Display instructions to user
 * - 4.9: Parse idAlumno from QR code
 * - 4.10: Show error if alumno not found
 * - 13.7: Handle camera permission denied
 */
export function QRScanner({
  isActive,
  onScan,
  onError,
  onStatusChange,
}: QRScannerProps) {
  const [status, setStatus] = useState<QRScannerStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isStartingRef = useRef(false)

  // Update status and notify parent
  const updateStatus = useCallback((newStatus: QRScannerStatus) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }, [onStatusChange])

  // Handle successful QR scan
  const handleScanSuccess = useCallback((decodedText: string) => {
    // Stop scanner after successful scan
    if (scannerRef.current) {
      const state = scannerRef.current.getState()
      if (state === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.stop().catch(console.error)
      }
    }
    updateStatus('success')
    onScan(decodedText)
  }, [onScan, updateStatus])

  // Handle scan error (called frequently when no QR is detected)
  const handleScanError = useCallback(() => {
    // This is called frequently when no QR is in view
    // We don't need to do anything here
  }, [])

  // Start the scanner
  const startScanner = useCallback(async () => {
    if (isStartingRef.current || !isActive) return
    
    isStartingRef.current = true
    updateStatus('initializing')
    setErrorMessage(null)

    try {
      // Create scanner instance if not exists
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(SCANNER_ELEMENT_ID)
      }

      // Check if already scanning
      const state = scannerRef.current.getState()
      if (state === Html5QrcodeScannerState.SCANNING) {
        updateStatus('scanning')
        isStartingRef.current = false
        return
      }

      // Start scanning with back camera preference
      await scannerRef.current.start(
        { facingMode: 'environment' },
        SCANNER_CONFIG,
        handleScanSuccess,
        handleScanError
      )

      updateStatus('scanning')
    } catch (err) {
      const error = err as Error
      console.error('QR Scanner error:', error)

      // Check for permission denied
      if (
        error.message?.includes('Permission') ||
        error.message?.includes('NotAllowedError') ||
        error.name === 'NotAllowedError'
      ) {
        updateStatus('permission_denied')
        setErrorMessage('Permiso de cámara denegado. Por favor habilita el acceso a la cámara.')
        onError?.('Permiso de cámara denegado. Por favor habilita el acceso a la cámara.')
      } else if (
        error.message?.includes('NotFoundError') ||
        error.name === 'NotFoundError'
      ) {
        updateStatus('error')
        setErrorMessage('No se encontró ninguna cámara en el dispositivo.')
        onError?.('No se encontró ninguna cámara en el dispositivo.')
      } else {
        updateStatus('error')
        setErrorMessage('Error al iniciar la cámara. Por favor intenta de nuevo.')
        onError?.('Error al iniciar la cámara. Por favor intenta de nuevo.')
      }
    } finally {
      isStartingRef.current = false
    }
  }, [isActive, handleScanSuccess, handleScanError, updateStatus, onError])

  // Stop the scanner
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop()
        }
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
    updateStatus('idle')
  }, [updateStatus])

  // Effect to start/stop scanner based on isActive
  useEffect(() => {
    if (isActive) {
      startScanner()
    } else {
      stopScanner()
    }

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.stop().catch(console.error)
        }
      }
    }
  }, [isActive, startScanner, stopScanner])

  // Retry starting the scanner
  const handleRetry = useCallback(() => {
    setErrorMessage(null)
    startScanner()
  }, [startScanner])

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="flex flex-col items-center">
      {/* Instructions - Requirement 4.8 */}
      <div className="text-center mb-4">
        <QrCode className="w-8 h-8 mx-auto text-[#9ca3af] mb-2" />
        <p className="text-[#9ca3af] text-sm">
          El alumno debe mostrar su código QR desde su perfil de la app
        </p>
      </div>

      {/* Scanner container */}
      <div className="relative w-full max-w-[300px] aspect-square rounded-lg overflow-hidden bg-black/20">
        {/* Scanner element - always rendered but may be hidden */}
        <div 
          id={SCANNER_ELEMENT_ID} 
          className={`w-full h-full ${status === 'scanning' ? '' : 'hidden'}`}
        />

        {/* Initializing state - Requirement 12.5 */}
        {status === 'initializing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-3" />
            <p className="text-white text-sm">Iniciando cámara...</p>
          </div>
        )}

        {/* Idle state */}
        {status === 'idle' && !isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="w-12 h-12 text-[#6b7280] mb-3" />
            <p className="text-[#9ca3af] text-sm text-center px-4">
              Activa el escáner para comenzar
            </p>
          </div>
        )}

        {/* Permission denied state - Requirement 13.7 */}
        {status === 'permission_denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <CameraOff className="w-12 h-12 text-[#ef4444] mb-3" />
            <p className="text-[#ef4444] text-sm text-center mb-4">
              {errorMessage}
            </p>
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={handleRetry}
            >
              Reintentar
            </GlassButton>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <AlertCircle className="w-12 h-12 text-[#f59e0b] mb-3" />
            <p className="text-[#f59e0b] text-sm text-center mb-4">
              {errorMessage}
            </p>
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={handleRetry}
            >
              Reintentar
            </GlassButton>
          </div>
        )}

        {/* Success state */}
        {status === 'success' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#22c55e]/20">
            <div className="w-16 h-16 rounded-full bg-[#22c55e] flex items-center justify-center mb-3">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <p className="text-[#22c55e] text-sm font-medium">
              ¡Código escaneado!
            </p>
          </div>
        )}

        {/* Scanning overlay with frame */}
        {status === 'scanning' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner markers */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#22c55e]" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#22c55e]" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#22c55e]" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#22c55e]" />
          </div>
        )}
      </div>

      {/* Status text below scanner */}
      {status === 'scanning' && (
        <p className="text-[#9ca3af] text-xs mt-3 text-center">
          Apunta la cámara al código QR del alumno
        </p>
      )}
    </div>
  )
}
