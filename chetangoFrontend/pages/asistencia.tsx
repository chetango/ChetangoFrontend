/**
 * CHETANGO ADMIN PANEL - ATTENDANCE PAGE
 * Marca asistencia de forma rápida con estilo premium
 * Layout Asimétrico Creativo 2025
 */

import { useState } from 'react';
import { 
  AmbientGlows,
  TypographyBackdrop,
  StatCardMini,
  GlassOrb,
  FloatingParticle,
  FloatingBadge,
  CreativeAnimations
} from '../components/creative-elements';
import { GlassPanel, Input, Select, Badge, Chip } from '../components/design-system';
import { 
  Search, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Sparkles,
  Package,
  Snowflake,
  AlertCircle
} from 'lucide-react';

// Mock data
const ESTUDIANTES_MOCK = [
  { 
    id: 1, 
    nombre: 'María Rodríguez', 
    documento: '42.567.123',
    paquete: { tipo: '8 Clases', usado: 3, disponible: 8, estado: 'activo' },
    asistencia: false,
    observacion: ''
  },
  { 
    id: 2, 
    nombre: 'Juan Pérez', 
    documento: '38.234.567',
    paquete: { tipo: '12 Clases', usado: 12, disponible: 12, estado: 'agotado' },
    asistencia: false,
    observacion: ''
  },
  { 
    id: 3, 
    nombre: 'Ana González', 
    documento: '41.876.432',
    paquete: { tipo: '16 Clases', usado: 5, disponible: 16, estado: 'congelado' },
    asistencia: false,
    observacion: ''
  },
  { 
    id: 4, 
    nombre: 'Carlos Martínez', 
    documento: '40.123.789',
    paquete: null,
    asistencia: false,
    observacion: ''
  },
  { 
    id: 5, 
    nombre: 'Lucía Fernández', 
    documento: '43.456.234',
    paquete: { tipo: '8 Clases', usado: 2, disponible: 8, estado: 'activo' },
    asistencia: true,
    observacion: ''
  },
  { 
    id: 6, 
    nombre: 'Diego Sánchez', 
    documento: '39.567.890',
    paquete: { tipo: '12 Clases', usado: 7, disponible: 12, estado: 'activo' },
    asistencia: true,
    observacion: 'Llegó tarde'
  },
];

export default function Asistencia() {
  const [selectedDate, setSelectedDate] = useState('2025-01-15');
  const [selectedClass, setSelectedClass] = useState('tango-intermedio-19');
  const [searchTerm, setSearchTerm] = useState('');
  const [estudiantes, setEstudiantes] = useState(ESTUDIANTES_MOCK);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filtrar estudiantes por búsqueda
  const estudiantesFiltrados = estudiantes.filter(est => 
    est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.documento.includes(searchTerm)
  );

  // Contadores
  const presentes = estudiantes.filter(e => e.asistencia).length;
  const ausentes = estudiantes.filter(e => !e.asistencia).length;
  const sinPaquete = estudiantes.filter(e => !e.paquete).length;

  // Toggle asistencia
  const handleToggleAsistencia = (id: number) => {
    setEstudiantes(prev => prev.map(est => {
      if (est.id === id) {
        const nuevoEstado = !est.asistencia;
        
        // Si está congelado y marca presente, descongela
        if (est.paquete?.estado === 'congelado' && nuevoEstado) {
          setToastMessage('Asistencia registrada. El paquete fue reactivado automáticamente.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          
          return {
            ...est,
            asistencia: nuevoEstado,
            paquete: { ...est.paquete, estado: 'activo' }
          };
        }
        
        return { ...est, asistencia: nuevoEstado };
      }
      return est;
    }));
  };

  // Update observación
  const handleObservacionChange = (id: number, value: string) => {
    setEstudiantes(prev => prev.map(est => 
      est.id === id ? { ...est, observacion: value } : est
    ));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0b]">
      {/* Ambient Background */}
      <AmbientGlows variant="warm" />
      
      {/* Typography Backdrop */}
      <TypographyBackdrop 
        text="ASIST" 
        orientation="vertical"
        position="right"
        size={280}
        opacity={0.35}
      />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Content - Offset Layout */}
      <div className="relative z-10 p-8 pl-[6%] pr-[6%]">
        
        {/* Header Asimétrico */}
        <div className="mb-10 max-w-[1600px]">
          <div className="flex items-start justify-between">
            {/* Left: Title */}
            <div>
              <FloatingBadge color="primary" className="mb-6">
                Registro de Asistencia
              </FloatingBadge>
              
              <h1 
                className="text-[#f9fafb] mb-4 tracking-tight"
                style={{ fontSize: '64px', fontWeight: 600, lineHeight: '1.1', letterSpacing: '-0.03em' }}
              >
                Asistencia
              </h1>
              
              <p className="text-[#d1d5db] max-w-2xl" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                Marca la asistencia de cada estudiante en tiempo real. Los cambios se guardan automáticamente.
              </p>
            </div>

            {/* Right: Avatar Admin */}
            <div className="flex items-center gap-4 backdrop-blur-xl bg-[rgba(42,42,48,0.6)] border border-[rgba(255,255,255,0.12)] rounded-2xl px-6 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col items-end">
                <p className="text-[#f9fafb]" style={{ fontSize: '15px' }}>Admin</p>
                <p className="text-[#9ca3af] text-[13px]">Chetango</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center shadow-[0_4px_16px_rgba(201,52,72,0.4)]">
                <span className="text-white font-semibold">AC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel Glass - Offset en grid */}
        <div className="max-w-[1600px]">
          <GlassPanel className="overflow-hidden">
            
            {/* Filters Bar - Glass Band */}
            <div className="p-6 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm">
              <div className="grid grid-cols-12 gap-4 items-end">
                
                {/* Fecha */}
                <div className="col-span-3">
                  <label className="block text-[#d1d5db] mb-2 text-[14px]">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Fecha de la Clase
                  </label>
                  <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="
                      w-full 
                      px-4 py-3 
                      backdrop-blur-xl 
                      bg-[rgba(30,30,36,0.6)] 
                      border border-[rgba(255,255,255,0.12)] 
                      focus:border-[#c93448] 
                      focus:ring-2 
                      focus:ring-[rgba(201,52,72,0.3)] 
                      rounded-xl 
                      text-[#f9fafb] 
                      outline-none 
                      transition-all duration-300 
                      shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                    "
                  />
                </div>

                {/* Clase */}
                <div className="col-span-4">
                  <label className="block text-[#d1d5db] mb-2 text-[14px]">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Clase del Día
                  </label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="
                      w-full 
                      px-4 py-3 
                      backdrop-blur-xl 
                      bg-[rgba(30,30,36,0.6)] 
                      border border-[rgba(255,255,255,0.12)] 
                      focus:border-[#c93448] 
                      focus:ring-2 
                      focus:ring-[rgba(201,52,72,0.3)] 
                      rounded-xl 
                      text-[#f9fafb] 
                      outline-none 
                      transition-all duration-300 
                      shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                    "
                  >
                    <option value="tango-intermedio-19">Tango Intermedio - 19:00 - Prof. Martín Gómez</option>
                    <option value="tango-avanzado-21">Tango Avanzado - 21:00 - Prof. Laura Díaz</option>
                    <option value="milonga-20">Milonga - 20:00 - Prof. Carlos Ruiz</option>
                  </select>
                </div>

                {/* Búsqueda */}
                <div className="col-span-5">
                  <label className="block text-[#d1d5db] mb-2 text-[14px]">
                    <Search className="w-4 h-4 inline mr-2" />
                    Buscar Estudiante
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                    <input 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nombre o documento..."
                      className="
                        w-full 
                        pl-12 pr-4 py-3 
                        backdrop-blur-xl 
                        bg-[rgba(30,30,36,0.6)] 
                        border border-[rgba(255,255,255,0.12)] 
                        focus:border-[#c93448] 
                        focus:ring-2 
                        focus:ring-[rgba(201,52,72,0.3)] 
                        rounded-xl 
                        text-[#f9fafb] 
                        placeholder-[#6b7280] 
                        outline-none 
                        transition-all duration-300 
                        shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table - Refined */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                    <th className="text-left px-8 py-5 text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                      Alumno
                    </th>
                    <th className="text-left px-6 py-5 text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                      Paquete
                    </th>
                    <th className="text-center px-6 py-5 text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                      Asistencia
                    </th>
                    <th className="text-left px-6 py-5 text-[#9ca3af] uppercase tracking-[0.1em] text-[12px] font-medium">
                      Observación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.map((estudiante, index) => (
                    <tr 
                      key={estudiante.id}
                      className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-200 group"
                    >
                      {/* Alumno */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgba(201,52,72,0.2)] to-[rgba(124,90,248,0.2)] flex items-center justify-center backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
                            <span className="text-[#f9fafb] font-medium">
                              {estudiante.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-[#f9fafb] font-medium" style={{ fontSize: '15px' }}>
                              {estudiante.nombre}
                            </p>
                            <p className="text-[#9ca3af] text-[13px] mt-0.5">
                              DNI: {estudiante.documento}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Paquete */}
                      <td className="px-6 py-6">
                        {estudiante.paquete ? (
                          <div className="space-y-2">
                            {/* Chip de estado */}
                            {estudiante.paquete.estado === 'activo' && (
                              <Chip variant="active" className="text-[13px]">
                                <Package className="w-3.5 h-3.5 inline mr-1.5" />
                                {estudiante.paquete.tipo}
                              </Chip>
                            )}
                            {estudiante.paquete.estado === 'agotado' && (
                              <Chip variant="depleted" className="text-[13px]">
                                <AlertCircle className="w-3.5 h-3.5 inline mr-1.5" />
                                Paquete Agotado
                              </Chip>
                            )}
                            {estudiante.paquete.estado === 'congelado' && (
                              <div>
                                <Chip variant="frozen" className="text-[13px]">
                                  <Snowflake className="w-3.5 h-3.5 inline mr-1.5" />
                                  Paquete Congelado
                                </Chip>
                                <p className="text-[#93c5fd] text-[11px] mt-2 italic flex items-start gap-1">
                                  <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                  <span>Si marcas presente, se reactivará automáticamente</span>
                                </p>
                              </div>
                            )}
                            
                            {/* Progress bar */}
                            {estudiante.paquete.estado !== 'congelado' && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      estudiante.paquete.estado === 'activo' 
                                        ? 'bg-gradient-to-r from-[#34d399] to-[#6ee7b7]' 
                                        : 'bg-gradient-to-r from-[#f59e0b] to-[#fcd34d]'
                                    }`}
                                    style={{ 
                                      width: `${(estudiante.paquete.usado / estudiante.paquete.disponible) * 100}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-[#9ca3af] text-[12px] whitespace-nowrap">
                                  {estudiante.paquete.usado}/{estudiante.paquete.disponible}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Chip variant="none" className="text-[13px]">
                            <AlertCircle className="w-3.5 h-3.5 inline mr-1.5" />
                            Sin paquete activo
                          </Chip>
                        )}
                      </td>

                      {/* Asistencia - Checkbox Premium */}
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleToggleAsistencia(estudiante.id)}
                            className="group/check relative"
                          >
                            {/* Checkbox custom */}
                            <div className={`
                              w-11 h-11 
                              rounded-xl 
                              border-2 
                              backdrop-blur-xl 
                              transition-all duration-300 
                              flex items-center justify-center
                              shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                              ${estudiante.asistencia 
                                ? 'bg-gradient-to-br from-[#34d399] to-[#059669] border-[#34d399] shadow-[0_8px_24px_rgba(52,211,153,0.4)]' 
                                : 'bg-[rgba(30,30,36,0.6)] border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(42,42,48,0.8)]'
                              }
                              group-hover/check:scale-110
                            `}>
                              {estudiante.asistencia ? (
                                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                              ) : (
                                <div className="w-4 h-4 rounded border-2 border-[#6b7280] group-hover/check:border-[#9ca3af]"></div>
                              )}
                            </div>
                            
                            {/* Label */}
                            <p className={`
                              text-[11px] mt-1.5 uppercase tracking-wider font-medium
                              ${estudiante.asistencia ? 'text-[#34d399]' : 'text-[#6b7280] group-hover/check:text-[#9ca3af]'}
                            `}>
                              {estudiante.asistencia ? 'Presente' : 'Ausente'}
                            </p>
                          </button>
                        </div>
                      </td>

                      {/* Observación */}
                      <td className="px-6 py-6">
                        <input 
                          type="text"
                          value={estudiante.observacion}
                          onChange={(e) => handleObservacionChange(estudiante.id, e.target.value)}
                          placeholder="Agregar nota..."
                          className="
                            w-full 
                            px-3 py-2 
                            backdrop-blur-xl 
                            bg-[rgba(30,30,36,0.4)] 
                            border border-[rgba(255,255,255,0.08)] 
                            focus:border-[#c93448] 
                            focus:bg-[rgba(30,30,36,0.6)] 
                            rounded-lg 
                            text-[#f9fafb] 
                            text-[13px]
                            placeholder-[#6b7280] 
                            outline-none 
                            transition-all duration-200
                          "
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {estudiantesFiltrados.length === 0 && (
                <div className="py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgba(156,163,175,0.1)] border border-[rgba(156,163,175,0.2)] mb-4">
                    <Search className="w-8 h-8 text-[#6b7280]" />
                  </div>
                  <p className="text-[#9ca3af]">No se encontraron estudiantes</p>
                </div>
              )}
            </div>

            {/* Summary Bar - Bottom */}
            <div className="p-6 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {/* Presentes */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[rgba(52,211,153,0.15)] backdrop-blur-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
                    </div>
                    <div>
                      <p className="text-[#9ca3af] text-[12px]">Presentes</p>
                      <p className="text-[#f9fafb] font-semibold" style={{ fontSize: '20px' }}>{presentes}</p>
                    </div>
                  </div>

                  {/* Ausentes */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[rgba(156,163,175,0.15)] backdrop-blur-sm">
                      <XCircle className="w-5 h-5 text-[#9ca3af]" />
                    </div>
                    <div>
                      <p className="text-[#9ca3af] text-[12px]">Ausentes</p>
                      <p className="text-[#f9fafb] font-semibold" style={{ fontSize: '20px' }}>{ausentes}</p>
                    </div>
                  </div>

                  {/* Sin Paquete */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[rgba(245,158,11,0.15)] backdrop-blur-sm">
                      <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
                    </div>
                    <div>
                      <p className="text-[#9ca3af] text-[12px]">Sin Paquete</p>
                      <p className="text-[#f9fafb] font-semibold" style={{ fontSize: '20px' }}>{sinPaquete}</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <p className="text-[#6b7280] text-[13px] italic">
                  Los cambios se guardan automáticamente
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Floating Stats - Creative Positioning */}
      <StatCardMini 
        icon={<Users className="w-5 h-5 text-[#34d399]" />}
        label="Total hoy"
        value={estudiantes.length}
        position="top-[12%] right-[3%]"
        delay="0s"
      />

      <StatCardMini 
        icon={<CheckCircle2 className="w-5 h-5 text-[#7c5af8]" />}
        label="Confirmados"
        value={presentes}
        position="top-[28%] right-[3%]"
        delay="0.5s"
      />

      {/* Glass Orbs Decorativos */}
      <GlassOrb 
        size="w-28 h-28"
        position="top-[50%] right-[2%]"
        color="primary"
        delay="0s"
      />

      <GlassOrb 
        size="w-20 h-20"
        position="bottom-[15%] left-[3%]"
        color="success"
        delay="1s"
      />

      {/* Floating Particles */}
      <FloatingParticle position="top-[15%] right-[15%]" color="#c93448" size="w-3 h-3" />
      <FloatingParticle position="top-[60%] left-[8%]" color="#34d399" size="w-2 h-2" delay="1s" />
      <FloatingParticle position="bottom-[25%] right-[20%]" color="#7c5af8" size="w-4 h-4" delay="1.5s" />

      {/* Toast Notification - Bottom Center */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[rgba(52,211,153,0.2)] to-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.4)] rounded-2xl px-6 py-4 shadow-[0_12px_48px_rgba(52,211,153,0.3),inset_0_2px_4px_rgba(255,255,255,0.1)] min-w-[400px]">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-[rgba(52,211,153,0.3)]">
                <Sparkles className="w-5 h-5 text-[#6ee7b7]" />
              </div>
              <p className="text-[#6ee7b7] font-medium" style={{ fontSize: '15px' }}>
                {toastMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <CreativeAnimations />
    </div>
  );
}
