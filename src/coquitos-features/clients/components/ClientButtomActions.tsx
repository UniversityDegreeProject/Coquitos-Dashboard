import { memo, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { Trash2, Edit2 } from "lucide-react";
import Swal from "sweetalert2";
import type { Client, SearchClientsParams } from "../interfaces";
import { useClientStore } from "../store/client.store";
import { useDeleteClient } from "../hooks";
import { useTheme } from "@/shared/hooks/useTheme";

interface ClientButtomActionsProps {
  client: Client;
  currentParams: SearchClientsParams;
  onPageEmpty?: () => void;
}

export const ClientButtomActions = memo(({ client, currentParams, onPageEmpty }: ClientButtomActionsProps) => {
  const { isDark } = useTheme();

  // *Zustand
  const setOpenModalUpdate = useClientStore(useShallow((state) => state.setOpenModalUpdate));
  const setIsMutation = useClientStore(useShallow((state) => state.setIsMutation));

  // * TanstackQuery
  const { deleteClientMutation } = useDeleteClient({ 
    currentParams, 
    onPageEmpty, 
    onFinally: () => setIsMutation(false) 
  });

  const handleDelete = useCallback(() => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cliente "${client.firstName} ${client.lastName}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsMutation(true);
        deleteClientMutation.mutate(client.id!);
      }
    });
  }, [client.id, client.firstName, client.lastName, deleteClientMutation, setIsMutation]);

  const handleEdit = useCallback(() => {
    setOpenModalUpdate(client);
  }, [client, setOpenModalUpdate]);

  return (
    <div className="flex space-x-2 flex-shrink-0">
      <button
        onClick={handleEdit}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300'
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
        }`}
        aria-label="Editar cliente"
        title="Editar cliente"
        type="button"
        disabled={!client.id}
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <button
        onClick={handleDelete}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
        }`}
        aria-label="Eliminar cliente"
        title="Eliminar cliente"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

