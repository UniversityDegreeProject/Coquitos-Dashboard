import { memo } from "react";
import { type SearchUsersParams, type User } from "../interfaces";
import { GenericGridLoader } from "@/shared/components";
import { UserEmptyState } from "./UserEmptyState";
import { UserListItem } from "./UserListItem";

interface UserGridProps {
  users: User[];
  isPending: boolean;
  currentParams: SearchUsersParams;
  onPageEmpty?: () => void;
}

/**
 * Componente que muestra los usuarios en formato de lista moderna
 * Refactorizado con componentes reutilizables para mejor mantenibilidad
 */
export const UserGrid = memo(({ users, isPending, currentParams, onPageEmpty }: UserGridProps) => {
  // Mostrar skeleton loader durante la carga
  if (isPending) {
    return <GenericGridLoader title="Cargando usuarios" />;
  }

  // Mostrar estado vacío cuando no hay usuarios
  if (users.length === 0) {
    return <UserEmptyState />;
  }

  // Renderizar lista de usuarios
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserListItem key={user.id} user={user} currentParams={currentParams} onPageEmpty={onPageEmpty} />
      ))}
    </div>
  );
});
