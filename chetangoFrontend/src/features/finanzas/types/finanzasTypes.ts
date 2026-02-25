// ============================================
// FINANZAS TYPES - CHETANGO ADMIN
// ============================================

// ============================================
// ENUMS Y CONSTANTES
// ============================================

export type Sede = 0 | 1

export const SEDE_LABELS: Record<Sede, string> = {
  0: 'Medellín',
  1: 'Manizales',
}

// ============================================
// OTRO INGRESO TYPES
// ============================================

/**
 * DTO para representar un ingreso adicional
 * GET /api/finanzas/otros-ingresos
 */
export interface OtroIngresoDTO {
  idOtroIngreso: string
  concepto: string
  monto: number
  fecha: string // ISO 8601
  sede: Sede
  sedeName: string
  idCategoriaIngreso?: string
  nombreCategoria?: string
  descripcion?: string
  urlComprobante?: string
  fechaCreacion: string
  usuarioCreacion: string
}

/**
 * DTO para crear un nuevo ingreso adicional
 * POST /api/finanzas/otros-ingresos
 */
export interface CrearOtroIngresoDTO {
  concepto: string
  monto: number
  fecha: string // YYYY-MM-DD
  sede: Sede
  idCategoriaIngreso?: string
  descripcion?: string
  urlComprobante?: string
}

// ============================================
// OTRO GASTO TYPES
// ============================================

/**
 * DTO para representar un gasto adicional
 * GET /api/finanzas/otros-gastos
 */
export interface OtroGastoDTO {
  idOtroGasto: string
  concepto: string
  monto: number
  fecha: string // ISO 8601
  sede: Sede
  sedeName: string
  idCategoriaGasto?: string
  nombreCategoria?: string
  proveedor?: string
  descripcion?: string
  urlFactura?: string
  numeroFactura?: string
  fechaCreacion: string
  usuarioCreacion: string
}

/**
 * DTO para crear un nuevo gasto adicional
 * POST /api/finanzas/otros-gastos
 */
export interface CrearOtroGastoDTO {
  concepto: string
  monto: number
  fecha: string // YYYY-MM-DD
  sede: Sede
  idCategoriaGasto?: string
  proveedor?: string
  descripcion?: string
  urlFactura?: string
  numeroFactura?: string
}

// ============================================
// CATEGORIA TYPES
// ============================================

/**
 * DTO para categorías de ingresos
 * GET /api/finanzas/categorias-ingreso
 */
export interface CategoriaIngresoDTO {
  id: string
  nombre: string
  descripcion?: string
}

/**
 * DTO para categorías de gastos
 * GET /api/finanzas/categorias-gasto
 */
export interface CategoriaGastoDTO {
  id: string
  nombre: string
  descripcion?: string
}

// ============================================
// QUERY PARAMS TYPES
// ============================================

export interface FinanzasQueryParams {
  fechaDesde?: string
  fechaHasta?: string
  sede?: Sede
  idCategoria?: string
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface OtroIngresoFormData {
  concepto: string
  monto: string
  fecha: string
  sede: Sede
  idCategoriaIngreso: string
  descripcion: string
  urlComprobante: string
}

export interface OtroGastoFormData {
  concepto: string
  monto: string
  fecha: string
  sede: Sede
  idCategoriaGasto: string
  proveedor: string
  descripcion: string
  urlFactura: string
  numeroFactura: string
}
