// ============================================
// USERS PAGE - ADMIN PANEL
// ============================================

import { Edit, Plus, Search, Trash2, UserCheck, UserX } from 'lucide-react'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDeleteUserMutation, useUserDetailQuery, useUsersQuery } from '../features/users/api/usersQueries'
import { CreateUserModal } from '../features/users/components'
import type { UserFilters, UserRole, UserStatus } from '../features/users/types/user.types'

const UsersPage = () => {
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editUserId, setEditUserId] = useState<string | null>(null)
  const [filters, setFilters] = useState<UserFilters>({
    pageNumber: 1,
    pageSize: 10,
    estado: 'activo', // Solo mostrar usuarios activos por defecto
  })

  const { data, isLoading } = useUsersQuery(filters)
  const deleteUserMutation = useDeleteUserMutation()
  
  // Solo cargar detalles del usuario si estamos editando
  const { data: userDetail } = useUserDetailQuery(editUserId || '')
  
  // Abrir modal de edición si se navega con editUserId en el state
  React.useEffect(() => {
    if (location.state?.editUserId) {
      setEditUserId(location.state.editUserId)
      setIsModalOpen(true)
      // Limpiar el state después de usarlo
      window.history.replaceState({}, document.title)
    }
  }, [location.state])
  
  // Debug: Log cuando userDetail cambia
  React.useEffect(() => {
    if (userDetail) {
      console.log('DEBUG - userDetail cargado:', userDetail)
      console.log('DEBUG - roles en userDetail:', userDetail.roles)
    }
  }, [userDetail])

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, busqueda: searchTerm, pageNumber: 1 }))
  }

  const handleRoleFilter = (rol?: UserRole) => {
    setFilters((prev) => ({ ...prev, rol, pageNumber: 1 }))
  }

  const handleStatusFilter = (estado?: UserStatus) => {
    setFilters((prev) => ({ ...prev, estado, pageNumber: 1 }))
  }

  const handleCreateUser = () => {
    setEditUserId(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (idUsuario: string) => {
    console.log('DEBUG - Abriendo modal de edición para usuario:', idUsuario)
    // Buscar el usuario en la lista actual para ver sus datos
    const usuarioEnLista = data?.items.find(u => u.idUsuario === idUsuario)
    console.log('DEBUG - Usuario en lista:', usuarioEnLista)
    console.log('DEBUG - Roles del usuario:', usuarioEnLista?.roles)
    setEditUserId(idUsuario)
    // Dar tiempo para que se cargue el userDetail antes de abrir el modal
    setTimeout(() => {
      setIsModalOpen(true)
    }, 100)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditUserId(null)
  }

  const handleDeleteUser = async (idUsuario: string) => {
    console.log('DEBUG - Intentando eliminar usuario:', idUsuario)
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
    
    try {
      console.log('DEBUG - Ejecutando mutación de eliminación...')
      await deleteUserMutation.mutateAsync({ idUsuario })
      console.log('DEBUG - Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error eliminando usuario:', error)
    }
  }

  const getRoleBadge = (rolOrRoles: UserRole | UserRole[] | undefined) => {
    // Compatibilidad: La API devuelve 'rol' (singular) pero antes era 'roles' (array)
    let rol: UserRole | undefined
    
    if (Array.isArray(rolOrRoles)) {
      // Si es array (formato antiguo)
      rol = rolOrRoles[0]
    } else {
      // Si es string (formato nuevo de la API)
      rol = rolOrRoles
    }
    
    if (!rol) {
      return <span className="text-[#9ca3af] text-sm">Sin rol</span>
    }
    
    const styles = {
      admin: 'bg-[rgba(139,92,246,0.15)] text-[#a78bfa] border-[rgba(139,92,246,0.3)]',
      profesor: 'bg-[rgba(59,130,246,0.15)] text-[#60a5fa] border-[rgba(59,130,246,0.3)]',
      alumno: 'bg-[rgba(34,197,94,0.15)] text-[#4ade80] border-[rgba(34,197,94,0.3)]',
    }
    const labels = {
      admin: '👨‍💼 Admin',
      profesor: '👨‍🏫 Profesor',
      alumno: '🧑‍🎓 Alumno',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[rol]}`}>
        {labels[rol]}
      </span>
    )
  }

  const getStatusBadge = (estado: UserStatus) => {
    const styles = {
      activo: 'bg-[rgba(34,197,94,0.15)] text-[#4ade80] border-[rgba(34,197,94,0.3)]',
      inactivo: 'bg-[rgba(156,163,175,0.15)] text-[#9ca3af] border-[rgba(156,163,175,0.3)]',
      pendiente_azure: 'bg-[rgba(245,158,11,0.15)] text-[#fbbf24] border-[rgba(245,158,11,0.3)]',
    }
    const labels = {
      activo: 'Activo',
      inactivo: 'Inactivo',
      pendiente_azure: 'Pendiente Azure',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[estado]}`}>
        {labels[estado]}
      </span>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[#f9fafb] text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">👥 Gestión de Usuarios</h1>
        <p className="text-[#9ca3af] text-sm sm:text-base">
          Administra usuarios del sistema: alumnos, profesores y administradores
        </p>
      </div>

      {/* Filters & Actions */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-3 md:gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#6b7280] w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o documento..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] text-[#f9fafb] text-sm sm:text-base placeholder:text-[#6b7280] focus:outline-none focus:border-[#c93448] transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Role Filter */}
          <select
            onChange={(e) => handleRoleFilter(e.target.value ? (e.target.value as UserRole) : undefined)}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] text-[#f9fafb] text-sm sm:text-base focus:outline-none focus:border-[#c93448] transition-colors min-h-[44px]"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="profesor">Profesores</option>
            <option value="alumno">Alumnos</option>
          </select>

          {/* Status Filter */}
          <select
            onChange={(e) => handleStatusFilter(e.target.value ? (e.target.value as UserStatus) : undefined)}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] text-[#f9fafb] text-sm sm:text-base focus:outline-none focus:border-[#c93448] transition-colors min-h-[44px]"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="pendiente_azure">Pendientes Azure</option>
          </select>

          {/* Create Button */}
          <button
            onClick={handleCreateUser}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#c93448] hover:bg-[#b02d3c] text-white rounded-lg font-medium transition-all whitespace-nowrap min-h-[44px] text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Crear Usuario
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg overflow-hidden">
        {/* Mobile hint */}
        <div className="lg:hidden bg-[rgba(26,26,26,0.5)] px-4 py-2 border-b border-[rgba(64,64,64,0.3)]">
          <p className="text-[#9ca3af] text-xs text-center">Desliza horizontalmente para ver más →</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[rgba(26,26,26,0.5)] border-b border-[rgba(64,64,64,0.3)]">
              <tr>
                <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[#9ca3af] text-xs sm:text-sm font-semibold whitespace-nowrap">
                  Usuario
                </th>
                <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[#9ca3af] text-xs sm:text-sm font-semibold whitespace-nowrap">
                  Contacto
                </th>
                <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[#9ca3af] text-xs sm:text-sm font-semibold whitespace-nowrap">
                  Rol
                </th>
                <th className="text-left px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[#9ca3af] text-xs sm:text-sm font-semibold whitespace-nowrap">
                  Estado
                </th>
                <th className="text-right px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[#9ca3af] text-xs sm:text-sm font-semibold whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#9ca3af]">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#c93448]/30 border-t-[#c93448] rounded-full animate-spin" />
                      Cargando usuarios...
                    </div>
                  </td>
                </tr>
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#9ca3af]">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                (data?.items || []).map((user) => (
                  <tr
                    key={user.idUsuario}
                    className="border-b border-[rgba(64,64,64,0.3)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div>
                        <p className="text-[#f9fafb] font-medium text-sm sm:text-base">{user.nombreUsuario}</p>
                        <p className="text-[#9ca3af] text-xs sm:text-sm">
                          {user.tipoDocumento} {user.numeroDocumento}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div>
                        <p className="text-[#f9fafb] text-xs sm:text-sm">{user.correo}</p>
                        <p className="text-[#9ca3af] text-xs sm:text-sm">{user.telefono}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">{getRoleBadge(user.rol || user.roles)}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">{getStatusBadge(user.estado)}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {user.estado === 'pendiente_azure' && (
                          <button
                            className="p-2 text-[#10b981] hover:bg-[rgba(16,185,129,0.1)] rounded-lg transition-colors min-w-[40px] min-h-[40px]"
                            title="Activar usuario"
                          >
                            <UserCheck size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        )}
                        {user.estado === 'activo' && (
                          <button
                            className="p-2 text-[#f59e0b] hover:bg-[rgba(245,158,11,0.1)] rounded-lg transition-colors min-w-[40px] min-h-[40px]"
                            title="Desactivar usuario"
                          >
                            <UserX size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        )}
                        <button
                          className="p-2 text-[#60a5fa] hover:bg-[rgba(96,165,250,0.1)] rounded-lg transition-colors min-w-[40px] min-h-[40px]"
                          title="Editar usuario"
                          onClick={() => handleEditUser((user as any).usuarioId || user.idUsuario)}
                        >
                          <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button
                          className="p-2 text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors min-w-[40px] min-h-[40px]"
                          title="Eliminar usuario"
                          onClick={() => handleDeleteUser((user as any).usuarioId || user.idUsuario)}
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-[rgba(64,64,64,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[#9ca3af] text-xs sm:text-sm">
              Mostrando {data.items?.length || 0} de {data.totalCount} usuarios
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, pageNumber: (prev.pageNumber || 1) - 1 }))}
                disabled={filters.pageNumber === 1}
                className="px-3 sm:px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] text-[#f9fafb] text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[40px]"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: data?.totalPages || 0 }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setFilters((prev) => ({ ...prev, page }))}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all text-sm ${
                      page === filters.pageNumber
                        ? 'bg-[#c93448] text-white'
                        : 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] text-[#f9fafb]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, pageNumber: (prev.pageNumber || 1) + 1 }))}
                disabled={filters.pageNumber === data.totalPages}
                className="px-3 sm:px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] text-[#f9fafb] text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[40px]"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          // React Query ya invalida la caché automáticamente en la mutación
          // Pero podemos forzar un refetch para estar seguros
          handleCloseModal()
        }}
        mode={editUserId ? 'edit' : 'create'}
        initialUser={editUserId && userDetail ? userDetail : undefined}
      />
    </div>
  )
}

export default UsersPage