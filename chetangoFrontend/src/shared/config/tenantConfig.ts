// ============================================
// TENANT CONFIG - Detección por hostname
// ============================================
// Un solo Static Web App sirve todos los subdominios de aphellion.com.
// El branding del login se resuelve en runtime leyendo el hostname.
//
// Regla:
//   corporacionchetango.aphellion.com  →  login Chetango (branding propio)
//   app.corporacionchetango.com        →  login Chetango (alias legacy)
//   [cualquier otro].aphellion.com     →  login genérico Aphellion
//   localhost / desarrollo             →  login genérico Aphellion por defecto

const hostname = typeof window !== 'undefined' ? window.location.hostname : ''

const CHETANGO_HOSTNAMES = [
  'corporacionchetango.aphellion.com',
  'app.corporacionchetango.com',
]

/** true si el visitante está en la URL de Corporación Chetango */
export const isChetango = CHETANGO_HOSTNAMES.some(h => hostname === h)

/** Subdominio activo, útil para logs o analytics */
export const tenantHostname = hostname
