import { useState } from 'react';
import { useGetClients, useDeleteClient } from '../hooks';
import { ClientSearchPage } from '../components';
import type { ClientResponse } from '../interfaces';
import Swal from 'sweetalert2';

/**
 * Página principal de gestión de clientes
 */
export const ClientsPage = () => {
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(null);
  
  // Hooks
  const { data: clients = [], isLoading } = useGetClients();
  const deleteClientMutation = useDeleteClient();

  // Handlers
  const handleEdit = (client: ClientResponse) => {
    setEditingClient(client);
    // TODO: Abrir modal de edición
    console.log('Editar cliente:', client);
  };

  const handleDelete = async (client: ClientResponse) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al cliente "${client.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteClientMutation.mutateAsync(client.id);
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const handleAdd = () => {
    // TODO: Abrir modal de creación
    console.log('Agregar nuevo cliente');
  };

  return (
    <div className="p-6">
      <ClientSearchPage
        clients={clients}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
};