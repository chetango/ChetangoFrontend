// ============================================
// MAIN LAYOUT WRAPPER - CHETANGO
// ============================================
// Wrapper que conecta MainLayout con lógica de auth

import { MainLayout } from '@/design-system/templates/MainLayout'
import { useAuth } from '@/features/auth'
import { RoleSelector } from '@/features/auth/components/RoleSelector/RoleSelector'
import { useActiveRole } from '@/features/auth/hooks/useActiveRole'
import { useCreateClaseMutation } from '@/features/classes/api/classMutations'
import { useProfesoresQuery, useTiposClaseQuery } from '@/features/classes/api/classQueries'
import { ClaseFormModal } from '@/features/classes/components'
import type { ClaseFormData, CrearClaseRequest } from '@/features/classes/types/classTypes'
import { formatearFechaHoraISO, formatearFechaParaInput, formatearHoraConSegundos, formatearHoraParaInput } from '@/features/classes/utils/claseHelpers'
import { RegisterPaymentModal } from '@/features/payments/components/RegisterPaymentModal'
import type { SolicitudClasePrivadaDTO, SolicitudRenovacionPaqueteDTO } from '@/features/solicitudes/types/solicitudesTypes'
import { getNavigationForUser } from '@/shared/lib/navigation'
import { useState } from 'react'

export const MainLayoutWrapper = () => {
  const { logout, session } = useAuth()
  const { activeRole } = useActiveRole()
  const isAdmin = session?.user?.roles?.includes('admin')
  const { data: tiposClase = [] } = useTiposClaseQuery()
  const { data: profesores = [] } = useProfesoresQuery(isAdmin)
  const createClaseMutation = useCreateClaseMutation()
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false)
  const [isClasePrivadaModalOpen, setIsClasePrivadaModalOpen] = useState(false)
  const [renovacionSeleccionada, setRenovacionSeleccionada] = useState<SolicitudRenovacionPaqueteDTO | null>(null)
  const [clasePrivadaSeleccionada, setClasePrivadaSeleccionada] = useState<SolicitudClasePrivadaDTO | null>(null)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al cerrar sesión:', error)
      }
    }
  }

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
    handleCloseClasePrivadaModal()
  }

  // Obtener navegación según el rol activo del usuario
  const navigationItems = getNavigationForUser(activeRole)

  const notaRenovacion = renovacionSeleccionada 
    ? [
        `Renovación solicitada por ${renovacionSeleccionada.nombreAlumno}`,
        renovacionSeleccionada.tipoPaqueteDeseado && `Desea: ${renovacionSeleccionada.tipoPaqueteDeseado}`,
        renovacionSeleccionada.mensajeAlumno && `Mensaje: ${renovacionSeleccionada.mensajeAlumno}`
      ].filter(Boolean).join(' | ')
    : undefined

  const prefillClaseData = clasePrivadaSeleccionada
    ? {
        fecha: clasePrivadaSeleccionada.fechaPreferida 
          ? formatearFechaParaInput(clasePrivadaSeleccionada.fechaPreferida) 
          : '',
        horaInicio: clasePrivadaSeleccionada.horaPreferida 
          ? formatearHoraParaInput(clasePrivadaSeleccionada.horaPreferida) 
          : '',
        horaFin: '',
        idTipoClase: tiposClase.find(t => 
          t.nombre.toLowerCase().includes(clasePrivadaSeleccionada.tipoClaseDeseado?.toLowerCase() || '')
        )?.id || '',
        observaciones: [
          `Solicitud clase privada - ${clasePrivadaSeleccionada.nombreAlumno}`,
          clasePrivadaSeleccionada.observacionesAlumno
        ].filter(Boolean).join(' | '),
      }
    : undefined

  return (
    <>
      <MainLayout 
        user={session.user} 
        onLogout={handleLogout}
        navigationItems={navigationItems}
        roleSelector={<RoleSelector />}
        onOpenRenovacion={handleOpenRenovacionModal}
        onOpenClasePrivada={handleOpenClasePrivadaModal}
      />

      {/* Modals para solicitudes desde notificaciones */}
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
        isCatalogsLoading={false}
        isSubmitting={createClaseMutation.isPending}
        mode="create"
        initialData={null}
        prefillData={prefillClaseData}
      />
    </>
  )
}