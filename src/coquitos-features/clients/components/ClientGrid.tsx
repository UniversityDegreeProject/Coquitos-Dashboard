
import { GenericGridLoader } from '@/shared/components/GenericLoader';
import type { Client, SearchClientsParams } from '../interfaces';
import { ClientEmptyState, ClientListItem } from "./";

interface ClientGridProps {
  clients: Client[];
  isPending: boolean;
  currentParams: SearchClientsParams;
  onPageEmpty?: () => void;
}

/**
 * Componente que muestra los clientes en formato de lista moderna
 * Refactorizado con componentes reutilizables para mejor mantenibilidad
 */
export const ClientGrid = ({ clients, isPending, currentParams, onPageEmpty }: ClientGridProps) => {

  if (isPending) return <GenericGridLoader title="Cargando clientes" />

  if (clients.length === 0) return <ClientEmptyState />

   // Renderizar lista de clientes
  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <ClientListItem key={client.id} client={client} currentParams={currentParams} onPageEmpty={onPageEmpty} />
      ))}
    </div>
  );
};