// ============================================
// CREATE USER MODAL - STEP 2: AZURE CREDENTIALS
// ============================================

import { useModalScroll } from '@/shared/hooks';
import { ArrowLeft, ExternalLink, Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface AzureCredentialsStepProps {
  onNext: (credentials: { email: string; temporaryPassword: string; sendWhatsApp: boolean; sendEmail: boolean }) => void
  onBack: () => void
  userEmail: string
}

export const AzureCredentialsStep = ({ onNext, onBack, userEmail }: AzureCredentialsStepProps) => {
  const containerRef = useModalScroll(true)

  const [email, setEmail] = useState(userEmail)
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [sendEmail, setSendEmail] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ email, temporaryPassword, sendWhatsApp, sendEmail })
  }

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
            🔐 Credenciales de Azure
          </h2>
          <p className="text-[#9ca3af] text-sm mt-2">
            Paso 2 de 3: Crear usuario en Azure Entra ID y pegar credenciales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Instrucciones */}
          <div className="bg-[rgba(201,52,72,0.1)] border border-[rgba(201,52,72,0.2)] rounded-lg p-4">
            <h3 className="text-[#f9fafb] font-semibold mb-3 flex items-center gap-2">
              📋 Instrucciones
            </h3>
            <ol className="text-[#d1d5db] text-sm space-y-2 list-decimal list-inside">
              <li>Abre el portal de Azure Entra ID en una nueva pestaña</li>
              <li>Ve a <strong>Usuarios</strong> → <strong>Nuevo usuario</strong></li>
              <li>Crea el usuario con el email: <span className="text-[#c93448] font-mono">{userEmail}</span></li>
              <li>Genera una contraseña temporal y márcala para cambiar en primer inicio</li>
              <li>Copia las credenciales y pégalas abajo</li>
            </ol>
            <a
              href="https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg transition-colors text-sm"
            >
              <ExternalLink size={16} />
              Abrir Azure Portal
            </a>
          </div>

          {/* Credenciales */}
          <div>
            <h3 className="text-[#f9fafb] font-semibold mb-4">🔑 Credenciales Generadas</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Email de Azure *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors font-mono text-sm"
                  placeholder="usuario@chetango.onmicrosoft.com"
                />
                <p className="text-[#6b7280] text-xs mt-1">
                  Confirma o edita el email generado en Azure
                </p>
              </div>

              <div>
                <label className="block text-[#9ca3af] text-sm mb-2">Contraseña Temporal *</label>
                <input
                  type="text"
                  required
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors font-mono text-sm"
                  placeholder="Pega aquí la contraseña temporal generada"
                />
                <p className="text-[#6b7280] text-xs mt-1">
                  Esta contraseña se enviará al usuario y deberá cambiarla en su primer inicio de sesión
                </p>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div>
            <h3 className="text-[#f9fafb] font-semibold mb-4">📢 Enviar Credenciales</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                  className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#c93448] checked:border-[#c93448] focus:ring-2 focus:ring-[rgba(201,52,72,0.3)] transition-all"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[#f9fafb] group-hover:text-[#c93448] transition-colors">
                    <MessageSquare size={18} />
                    <span className="font-medium">Enviar por WhatsApp</span>
                  </div>
                  <p className="text-[#9ca3af] text-xs mt-0.5">
                    Envía un mensaje con las credenciales al número registrado
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#c93448] checked:border-[#c93448] focus:ring-2 focus:ring-[rgba(201,52,72,0.3)] transition-all"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[#f9fafb] group-hover:text-[#c93448] transition-colors">
                    <Mail size={18} />
                    <span className="font-medium">Enviar por Email</span>
                  </div>
                  <p className="text-[#9ca3af] text-xs mt-0.5">
                    Envía un correo con las credenciales al email personal registrado
                  </p>
                </div>
              </label>
            </div>

            {!sendWhatsApp && !sendEmail && (
              <div className="mt-3 p-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-lg">
                <p className="text-[#fbbf24] text-sm">
                  ⚠️ No se enviará notificación. Deberás compartir las credenciales manualmente.
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all"
            >
              <ArrowLeft size={18} />
              Atrás
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-[#c93448] hover:bg-[#b02d3c] text-white font-medium transition-all"
            >
              Continuar →
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
