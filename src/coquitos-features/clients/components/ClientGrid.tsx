
import type { Client } from '../interfaces';
import { ClientSkeleton, ClientEmptyState, ClientList } from "./";

interface ClientGridProps {
  clients: Client[];
  isLoading: boolean;
}

/**
 * Componente que muestra los clientes en formato de lista moderna
 * Sigue el patrón de UserGrid y CategoryGridTable
 */
export const ClientGrid = ({ clients, isLoading }: ClientGridProps) => {

  // Loading state
  if (isLoading) return <ClientSkeleton />

  // Empty state
  if (clients.length === 0) return <ClientEmptyState />

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <ClientList
          key={client.id}
          client={client}
        />
      ))}
    </div>
  );
};