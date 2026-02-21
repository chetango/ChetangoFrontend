// ============================================
// CREATE USER MODAL - STEP 3: CONFIRMATION
// ============================================

import { useModalScroll } from '@/shared/hooks'
import { ArrowLeft, Check, Mail, MessageSquare, User } from 'lucide-react'
import type { CreateUserRequest } from '../types/user.types'

interface ConfirmationStepProps {
  userData: Partial<CreateUserRequest>
  credentials: {
    email: string
    sendWhatsApp: boolean
    sendEmail: boolean
  }
  onConfirm: () => void
  onBack: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export const ConfirmationStep = ({
  userData,
  credentials,
  onConfirm,
  onBack,
  isLoading,
  mode = 'create',
}: ConfirmationStepProps) => {
  const containerRef = useModalScroll(true)

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[100] pt-20 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={onBack}
      />

      {/* Modal */}
      <div className="relative flex items-start justify-center p-4 min-h-full">
        <div className="bg-[rgba(26,26,26,0.98)] border border-[rgba(64,64,64,0.3)] rounded-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-[rgba(26,26,26,0.98)] border-b border-[rgba(64,64,64,0.3)] p-6">
          <h2 className="text-[#f9fafb] text-2xl font-semibold">
            ✅ {mode === 'edit' ? 'Confirmar Edición' : 'Confirmar Creación'}
          </h2>
          <p className="text-[#9ca3af] text-sm mt-2">
            {mode === 'edit' 
              ? 'Revisa los cambios antes de actualizar el usuario'
              : 'Paso 3 de 3: Revisa los datos antes de crear el usuario'
            }
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Resumen del Usuario */}
          <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg p-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[rgba(201,52,72,0.15)] border-2 border-[rgba(201,52,72,0.3)] flex items-center justify-center text-[#c93448] text-2xl">
                {userData.rol === 'admin' && '👨‍💼'}
                {userData.rol === 'profesor' && '👨‍🏫'}
                {userData.rol === 'alumno' && '🧑‍🎓'}
              </div>
              <div className="flex-1">
                <h3 className="text-[#f9fafb] text-xl font-semibold">
                  {userData.nombreUsuario}
                </h3>
                <p className="text-[#c93448] text-sm font-medium mt-1">
                  {userData.rol === 'admin' && 'Administrador'}
                  {userData.rol === 'profesor' && 'Profesor'}
                  {userData.rol === 'alumno' && 'Alumno'}
                </p>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div>
            <h4 className="text-[#f9fafb] font-semibold mb-3 flex items-center gap-2">
              <User size={18} />
              Información Personal
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem label="Email Personal" value={userData.correo} />
              <InfoItem label="Teléfono" value={userData.telefono} />
              <InfoItem label="Documento" value={`${userData.tipoDocumento} ${userData.numeroDocumento}`} />
              <InfoItem label="Fecha Nacimiento" value={userData.fechaNacimiento} />
            </div>
          </div>

          {/* Datos Específicos por Rol */}
          {userData.rol === 'alumno' && userData.datosAlumno && (
            <div>
              <h4 className="text-[#f9fafb] font-semibold mb-3">👤 Datos de Alumno</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoItem label="Contacto Emergencia" value={userData.datosAlumno.contactoEmergencia} />
                <InfoItem label="Teléfono Emergencia" value={userData.datosAlumno.telefonoEmergencia} />
                {userData.datosAlumno.observacionesMedicas && (
                  <div className="col-span-2">
                    <InfoItem label="Observaciones Médicas" value={userData.datosAlumno.observacionesMedicas} />
                  </div>
                )}
              </div>
            </div>
          )}

          {userData.rol === 'profesor' && userData.datosProfesor && (
            <div>
              <h4 className="text-[#f9fafb] font-semibold mb-3">🎓 Datos de Profesor</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoItem label="Tipo" value={userData.datosProfesor.tipoProfesor} />
                <InfoItem label="Fecha Ingreso" value={userData.datosProfesor.fechaIngreso} />
                <InfoItem 
                  label="Tarifa por Hora" 
                  value={userData.datosProfesor.tarifaActual ? `$${userData.datosProfesor.tarifaActual.toLocaleString('es-CO')} COP` : 'No especificada'} 
                />
                {userData.datosProfesor.especialidades && userData.datosProfesor.especialidades.length > 0 && (
                  <div className="col-span-2">
                    <InfoItem label="Especialidades" value={userData.datosProfesor.especialidades.join(', ')} />
                  </div>
                )}
                {userData.datosProfesor.biografia && (
                  <div className="col-span-2">
                    <InfoItem label="Biografía" value={userData.datosProfesor.biografia} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Credenciales de Azure - Solo en modo creación */}
          {mode === 'create' && (
            <div className="bg-[rgba(201,52,72,0.1)] border border-[rgba(201,52,72,0.2)] rounded-lg p-4">
              <h4 className="text-[#f9fafb] font-semibold mb-3">🔐 Credenciales de Azure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#9ca3af]">Email Azure:</span>
                  <span className="text-[#f9fafb] font-mono">{credentials.email}</span>
                </div>
                <p className="text-[#6b7280] text-xs mt-2">
                  La contraseña temporal será gestionada por Azure y enviada al usuario en su primer acceso.
                </p>
              </div>
            </div>
          )}

          {/* Notificaciones - Solo en modo creación */}
          {mode === 'create' && (
            <div>
              <h4 className="text-[#f9fafb] font-semibold mb-3">📢 Notificaciones</h4>
              <div className="space-y-2">
                {credentials.sendWhatsApp && (
                  <div className="flex items-center gap-2 text-[#10b981] text-sm">
                    <Check size={16} />
                    <MessageSquare size={16} />
                    <span>Se enviará mensaje por WhatsApp</span>
                  </div>
              )}
              {credentials.sendEmail && (
                <div className="flex items-center gap-2 text-[#10b981] text-sm">
                  <Check size={16} />
                  <Mail size={16} />
                  <span>Se enviará correo electrónico</span>
                </div>
              )}
                {!credentials.sendWhatsApp && !credentials.sendEmail && (
                  <div className="text-[#fbbf24] text-sm">
                    ⚠️ No se enviará notificación automática
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warning - Solo en modo creación */}
          {mode === 'create' && (
            <div className="bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-lg p-4">
              <p className="text-[#fbbf24] text-sm">
                ⚠️ <strong>Importante:</strong> Asegúrate de que el usuario fue creado correctamente en Azure Entra ID antes de confirmar.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} />
              Atrás
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'edit' ? 'Guardando cambios...' : 'Creando usuario...'}
                </>
              ) : (
                <>
                  <Check size={18} />
                  {mode === 'edit' ? 'Guardar Cambios' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

// Helper component
const InfoItem = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null
  return (
    <div>
      <p className="text-[#6b7280] text-xs mb-1">{label}</p>
      <p className="text-[#f9fafb]">{value}</p>
    </div>
  )
}
