// ============================================
// NOTIFICATIONS PAGE - ADMIN
// ============================================

import { AmbientGlows } from '@/design-system/decorative'
import { useCreateClaseMutation } from '@/features/classes/api/classMutations'
import { useProfesoresQuery, useTiposClaseQuery } from '@/features/classes/api/classQueries'
import { ClaseFormModal } from '@/features/classes/components'
import type { ClaseFormData, CrearClaseRequest } from '@/features/classes/types/classTypes'
import { formatearFechaHoraISO, formatearFechaParaInput, formatearHoraConSegundos, formatearHoraParaInput } from '@/features/classes/utils/claseHelpers'
import { RegisterPaymentModal } from '@/features/payments/components/RegisterPaymentModal'
import { SolicitudesNotifications } from '@/features/solicitudes'
import type { SolicitudClasePrivadaDTO, SolicitudRenovacionPaqueteDTO } from '@/features/solicitudes/types/solicitudesTypes'
import { Bell } from 'lucide-react'
import { useMemo, useState } from 'react'

const NotificationsPage = () => {
  const { data: tiposClase = [], isLoading: loadingTiposClase } = useTiposClaseQuery()
  const { data: profesores = [], isLoading: loadingProfesores } = useProfesoresQuery()
  const createClaseMutation = useCreateClaseMutation()
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false)
  const [isClasePrivadaModalOpen, setIsClasePrivadaModalOpen] = useState(false)
  const [renovacionSeleccionada, setRenovacionSeleccionada] = useState<SolicitudRenovacionPaqueteDTO | null>(null)
  const [clasePrivadaSeleccionada, setClasePrivadaSeleccionada] = useState<SolicitudClasePrivadaDTO | null>(null)
  const isCatalogsLoading = loadingTiposClase || loadingProfesores

  const notaRenovacion = useMemo(() => {
    if (!renovacionSeleccionada) return undefined

    const parts = [`Renovación solicitada por ${renovacionSeleccionada.nombreAlumno}`]
    if (renovacionSeleccionada.tipoPaqueteDeseado) {
      parts.push(`Desea: ${renovacionSeleccionada.tipoPaqueteDeseado}`)
    }
    if (renovacionSeleccionada.mensajeAlumno) {
      parts.push(`Mensaje: ${renovacionSeleccionada.mensajeAlumno}`)
    }

    return parts.join(' | ')
  }, [renovacionSeleccionada])

  const prefillClaseData = useMemo(() => {
    if (!clasePrivadaSeleccionada) return undefined

    const tipoDeseado = clasePrivadaSeleccionada.tipoClaseDeseado?.toLowerCase()
    const tipoMatch = tipoDeseado
      ? tiposClase.find(tipo => tipo.nombre.toLowerCase() === tipoDeseado || tipo.nombre.toLowerCase().includes(tipoDeseado))
      : undefined

    const fecha = clasePrivadaSeleccionada.fechaPreferida
      ? formatearFechaParaInput(clasePrivadaSeleccionada.fechaPreferida)
      : ''
    const horaInicio = clasePrivadaSeleccionada.horaPreferida
      ? formatearHoraParaInput(clasePrivadaSeleccionada.horaPreferida)
      : ''

    const observacionesParts = [`Solicitud clase privada - ${clasePrivadaSeleccionada.nombreAlumno}`]
    if (clasePrivadaSeleccionada.observacionesAlumno) {
      observacionesParts.push(clasePrivadaSeleccionada.observacionesAlumno)
    }

    return {
      fecha,
      horaInicio,
      horaFin: '',
      idTipoClase: tipoMatch?.id || '',
      observaciones: observacionesParts.join(' | '),
    }
  }, [clasePrivadaSeleccionada, tiposClase])

  const handleOpenRenovacionModal = (solicitud: SolicitudRenovacionPaqueteDTO) => {
    setRenovacionSeleccionada(solicitud)
    setIsPagoModalOpen(true)
  }

  const handleCloseRenovacionModal = () => {
    setIsPagoModalOpen(false)
    setRenovacionSeleccionada(null)
  }

  const handleOpenClasePrivadaModal = (solicitud: SolicitudClasePrivadaDTO) => {
    setClasePrivadaSeleccionada(solicitud)
    setIsClasePrivadaModalOpen(true)
  }

  const handleCloseClasePrivadaModal = () => {
    setIsClasePrivadaModalOpen(false)
    setClasePrivadaSeleccionada(null)
  }

  const handleCreateClaseFromSolicitud = async (formData: ClaseFormData) => {
    const request: CrearClaseRequest = {
      profesores: formData.profesores.map(p => ({
        idProfesor: p.idProfesor,
        rolEnClase: p.rolEnClase,
      })),
      idTipoClase: formData.idTipoClase,
      fecha: formatearFechaHoraISO(formData.fecha, '00:00'),
      horaInicio: formatearHoraConSegundos(formData.horaInicio),
      horaFin: formatearHoraConSegundos(formData.horaFin),
      cupoMaximo: formData.cupoMaximo,
      observaciones: formData.observaciones || undefined,
    }

    await createClaseMutation.mutateAsync(request)
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Ambient Background */}
      <AmbientGlows variant="default" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-[#c93448]" />
              <h1 className="text-[#f9fafb] text-3xl md:text-4xl font-bold">
                Notificaciones
              </h1>
            </div>
            <p className="text-[#9ca3af] text-lg">
              Gestiona todas las solicitudes y alertas del sistema
            </p>
          </div>

          {/* Notifications List */}
          <SolicitudesNotifications
            maxItems={20}
            onOpenRenovacion={handleOpenRenovacionModal}
            onOpenClasePrivada={handleOpenClasePrivadaModal}
          />

          {/* Modals */}
          <RegisterPaymentModal
            isOpen={isPagoModalOpen}
            onClose={handleCloseRenovacionModal}
            onSuccess={handleCloseRenovacionModal}
            initialAlumno={
              renovacionSeleccionada
                ? {
                    idAlumno: renovacionSeleccionada.idAlumno,
                    nombre: renovacionSeleccionada.nombreAlumno,
                    correo: renovacionSeleccionada.correoAlumno,
                  }
                : null
            }
            initialNota={notaRenovacion}
          />

          <ClaseFormModal
            isOpen={isClasePrivadaModalOpen}
            onClose={handleCloseClasePrivadaModal}
            onSubmit={handleCreateClaseFromSolicitud}
            tiposClase={tiposClase}
            profesores={profesores}
            isCatalogsLoading={isCatalogsLoading}
            isSubmitting={createClaseMutation.isPending}
            mode="create"
            initialData={null}
            prefillData={prefillClaseData}
          />

        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
