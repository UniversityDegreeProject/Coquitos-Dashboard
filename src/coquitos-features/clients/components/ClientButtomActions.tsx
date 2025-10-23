import { memo } from "react"
import { useShallow } from "zustand/shallow"

import { Trash2 } from "lucide-react"
import { Edit2 } from "lucide-react"
import type { Client } from "../interfaces"
import { useClientStore } from "../store/client.store"
import Swal from "sweetalert2"
import { useDeleteClient } from "../hooks"


interface ClientButtomActionsProps {
  client : Client
}

export const ClientButtomActions = memo(({ client }: ClientButtomActionsProps) => {

  // *Zustand
  const setOpenModalUpdate = useClientStore(useShallow((state) => state.setOpenModalUpdate));

  // * TanstackQuery
  const { deleteClientMutation } = useDeleteClient();

  const handleEdit = () => {
    setOpenModalUpdate(client);
  };

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cliente "${client.firstName} ${client.lastName}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClientMutation.mutate(client.id!)
      }
    });
  };

  return (

    <div className="flex space-x-2">
      <button
        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
        aria-label="Editar cliente"
        title="Editar cliente"
        disabled={!client.id}
        onClick={handleEdit}
      >
        <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
        aria-label="Eliminar cliente"
        title="Eliminar cliente"
      >
        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
      </button>
  </div>
  )
})

