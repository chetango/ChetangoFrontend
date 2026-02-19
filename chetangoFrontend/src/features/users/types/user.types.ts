// ============================================
// USER TYPES - CHETANGO
// ============================================

export type UserRole = 'admin' | 'profesor' | 'alumno'

export type UserStatus = 'pendiente_azure' | 'activo' | 'inactivo'

export type Sede = 1 | 2 // 1 = Medellín, 2 = Manizales

export interface User {
  idUsuario: string
  nombreUsuario: string
  correo: string
  telefono: string
  tipoDocumento: string
  numeroDocumento: string
  fechaCreacion: string
  estado: UserStatus
  rol: UserRole  // API devuelve rol singular
  roles?: UserRole[]  // Mantener opcional para compatibilidad
  sede: Sede
  sedeNombre: string
  idProfesor?: string
  idAlumno?: string
}

export interface UserDetail extends User {
  datosProfesor?: ProfesorData
  datosAlumno?: AlumnoData
}

export interface ProfesorData {
  idProfesor: string
  tipoProfesor: string
  fechaIngreso: string
  biografia?: string
  especialidades: string[]
  tarifaActual: number
  notificacionesEmail: boolean
  recordatoriosClase: boolean
  alertasCambios: boolean
}

export interface AlumnoData {
  idAlumno: string
  contactoEmergencia?: string
  telefonoEmergencia?: string
  fechaNacimiento?: string
  observacionesMedicas?: string
  alertasPaquete: boolean
  notificacionesEmail: boolean
}

// Request types
export interface CreateUserRequest {
  // Datos básicos
  nombreUsuario: string
  correo: string
  telefono: string
  tipoDocumento: string
  numeroDocumento: string
  rol: UserRole
  fechaNacimiento?: string
  
  // Datos específicos de alumno
  datosAlumno?: {
    contactoEmergencia?: string
    telefonoEmergencia?: string
    observacionesMedicas?: string
  }
  
  // Datos específicos de profesor
  datosProfesor?: {
    tipoProfesor: string
    fechaIngreso: string
    especialidades: string[]
    biografia?: string
    tarifaActual: number
  }
  
  // Credenciales de Azure (agregado por admin)
  correoAzure: string
  contrasenaTemporalAzure: string
  enviarWhatsApp: boolean
  enviarEmail: boolean
  
  // Paquete inicial (solo alumnos)
  paqueteInicial?: {
    idTipoPaquete: string
    clasesDisponibles: number
    valorPaquete: number
    diasVigencia: number
  }
}

export interface ActivateUserRequest {
  idUsuario: string
  passwordTemporal: string
  enviarWhatsApp: boolean
  enviarEmail: boolean
}

export interface UpdateUserRequest {
  idUsuario: string
  nombreUsuario: string
  telefono: string
  fechaNacimiento?: string
  datosProfesor?: {
    tipoProfesor: string
    fechaIngreso: string
    especialidades: string[]
    biografia?: string
    tarifaActual: number
  }
  datosAlumno?: {
    contactoEmergencia?: string
    telefonoEmergencia?: string
    observacionesMedicas?: string
  }
}

export interface DeleteUserRequest {
  idUsuario: string
  motivo?: string
}

// Filter types
export interface UserFilters {
  busqueda?: string
  rol?: UserRole | 'todos'
  estado?: UserStatus | 'todos'
  pageNumber?: number
  pageSize?: number
}

// Pagination - Backend response
export interface PaginatedUsersBackend {
  usuarios: User[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
}

// Pagination - Frontend interface
export interface PaginatedUsers {
  items: User[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
