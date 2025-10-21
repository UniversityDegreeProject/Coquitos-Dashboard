export const useQuerys = {
  allUsers: ['users'] as const,
  userById: (id: string) => [useQuerys.allUsers, id] as const,
  userByEmail: (email: string) => [useQuerys.allUsers, email] as const,
  usersPaginated: (params: {
    page?: number;
    limit?: number;
  }) => [useQuerys.allUsers, 'paginated', params] as const,
  searchUsers: (params: {
    search?: string;
    role?: 'Administrador' | 'Cajero';
    status?: 'Activo' | 'Inactivo' | 'Suspendido';
    page?: number;
    limit?: number;
  }) => [useQuerys.allUsers, params] as const,


}