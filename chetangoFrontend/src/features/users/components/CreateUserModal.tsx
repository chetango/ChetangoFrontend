// ============================================
// CREATE USER MODAL - MAIN ORCHESTRATOR
// ============================================

import { useEffect, useState } from 'react'
import { useCreateUserMutation, useUpdateUserMutation } from '../api/usersQueries'
import type { CreateUserRequest, UpdateUserRequest, UserDetail } from '../types/user.types'
import { AzureCredentialsStep } from './AzureCredentialsStep'
import { ConfirmationStep } from './ConfirmationStep'
import { UserFormStep } from './UserFormStep'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  mode?: 'create' | 'edit'
  initialUser?: UserDetail
}

type WizardStep = 'form' | 'azure' | 'confirmation'

export const CreateUserModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  mode = 'create',
  initialUser 
}: CreateUserModalProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('form')
  const [userData, setUserData] = useState<Partial<CreateUserRequest>>({})
  const [credentials, setCredentials] = useState({
    email: '',
    sendWhatsApp: true,
    sendEmail: true,
  })

  const createUserMutation = useCreateUserMutation()
  const updateUserMutation = useUpdateUserMutation()

  // Reset del estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('form')
      setUserData({})
      setCredentials({
        email: '',
        sendWhatsApp: true,
        sendEmail: true,
      })
    }
  }, [isOpen])

  // Cargar datos iniciales cuando se abre en modo edición
  useEffect(() => {
    if (mode === 'edit' && initialUser && isOpen) {
      console.log('DEBUG - Cargando datos del usuario para edición:', initialUser)
      
      // Inferir el rol desde los datos disponibles
      let rolInferido: 'admin' | 'profesor' | 'alumno' = 'alumno'
      if (initialUser.datosProfesor) {
        rolInferido = 'profesor'
      } else if (initialUser.datosAlumno) {
        rolInferido = 'alumno'
      } else {
        rolInferido = 'admin'
      }
      
      // También intentar obtener el rol desde roles array si existe
      const rolDesdeArray = initialUser.roles?.[0]
      const rolFinal = rolDesdeArray || rolInferido
      
      console.log('DEBUG - Rol inferido desde datos:', rolInferido)
      console.log('DEBUG - Rol desde array:', rolDesdeArray)
      console.log('DEBUG - Rol final:', rolFinal)
      
      setUserData({
        nombreUsuario: initialUser.nombreUsuario,
        correo: initialUser.correo,
        telefono: initialUser.telefono,
        tipoDocumento: initialUser.tipoDocumento,
        numeroDocumento: initialUser.numeroDocumento,
        rol: rolFinal,
        fechaNacimiento: initialUser.datosAlumno?.fechaNacimiento,
        datosProfesor: initialUser.datosProfesor,
        datosAlumno: initialUser.datosAlumno,
      })
    }
  }, [mode, initialUser, isOpen])

  if (!isOpen) return null

  const handleFormNext = (data: Partial<CreateUserRequest>) => {
    setUserData(data)
    
    // En modo edición, saltamos directo a confirmación
    if (mode === 'edit') {
      setCurrentStep('confirmation')
    } else {
      setCredentials((prev) => ({ ...prev, email: data.correo || '' }))
      setCurrentStep('azure')
    }
  }

  const handleAzureNext = (creds: typeof credentials) => {
    setCredentials(creds)
    setCurrentStep('confirmation')
  }

  const handleConfirm = async () => {
    if (mode === 'edit' && initialUser) {
      // Modo edición - usar UpdateUserRequest
      console.log('DEBUG - initialUser completo:', initialUser)
      
      // El backend puede enviar idUsuario o IdUsuario (camelCase vs PascalCase)
      const userId = (initialUser as any).idUsuario || (initialUser as any).IdUsuario || (initialUser as any).id
      console.log('DEBUG - userId encontrado:', userId)
      
      if (!userId) {
        console.error('ERROR - No se pudo encontrar el ID del usuario en initialUser:', initialUser)
        return
      }
      
      const updateData: UpdateUserRequest = {
        idUsuario: userId,
        nombreUsuario: userData.nombreUsuario!,
        telefono: userData.telefono!,
        fechaNacimiento: userData.fechaNacimiento,
        datosProfesor: userData.datosProfesor,
        datosAlumno: userData.datosAlumno,
      }

      console.log('DEBUG - UpdateUserRequest:', updateData)
      console.log('DEBUG - URL que se construirá:', `/api/usuarios/${updateData.idUsuario}`)

      try {
        await updateUserMutation.mutateAsync(updateData)
        onSuccess?.()
        handleClose()
      } catch (error) {
        console.error('Error updating user:', error)
      }
    } else {
      // Modo creación - usar CreateUserRequest
      console.log('DEBUG - userData antes de crear request:', userData)
      
      const requestData: CreateUserRequest = {
        nombreUsuario: userData.nombreUsuario!,
        correo: userData.correo!,
        telefono: userData.telefono!,
        tipoDocumento: userData.tipoDocumento!,
        numeroDocumento: userData.numeroDocumento!,
        rol: userData.rol!,
        fechaNacimiento: userData.fechaNacimiento,
        datosProfesor: userData.datosProfesor,
        datosAlumno: userData.datosAlumno,
        correoAzure: credentials.email,
        enviarWhatsApp: credentials.sendWhatsApp,
        enviarEmail: credentials.sendEmail,
      }

      console.log('DEBUG - requestData a enviar:', requestData)

      try {
        await createUserMutation.mutateAsync(requestData)
        onSuccess?.()
        handleClose()
      } catch (error) {
        console.error('Error creating user:', error)
      }
    }
  }

  const handleClose = () => {
    setCurrentStep('form')
    setUserData({})
    setCredentials({
      email: '',
      sendWhatsApp: true,
      sendEmail: true,
    })
    onClose()
  }

  return (
    <>
      {currentStep === 'form' && (
        <UserFormStep
          onNext={handleFormNext}
          onCancel={handleClose}
          initialData={userData}
          mode={mode}
        />
      )}

      {currentStep === 'azure' && mode === 'create' && (
        <AzureCredentialsStep
          onNext={handleAzureNext}
          onBack={() => setCurrentStep('form')}
          userEmail={userData.correo || ''}
        />
      )}

      {currentStep === 'confirmation' && (
        <ConfirmationStep
          userData={userData}
          credentials={credentials}
          onConfirm={handleConfirm}
          onBack={() => setCurrentStep(mode === 'edit' ? 'form' : 'azure')}
          isLoading={createUserMutation.isPending || updateUserMutation.isPending}
          mode={mode}
        />
      )}
    </>
  )
}
