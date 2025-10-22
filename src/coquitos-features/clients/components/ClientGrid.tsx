import { ClientCard } from './ClientCard';
import type { ClientResponse } from '../interfaces';

interface ClientGridProps {
  clients: ClientResponse[];
  onEdit?: (client: ClientResponse) => void;
  onDelete?: (client: ClientResponse) => void;
}

/**
 * Grid de tarjetas de clientes
 */
export const ClientGrid = ({ clients, onEdit, onDelete }: ClientGridProps) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No hay clientes para mostrar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};