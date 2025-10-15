import { Edit2, Trash2, MailCheck, Eye, KeyRound } from "lucide-react";

export const UserButtomsActions = () => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
      <div className="flex space-x-2">
        <button
          className="text-indigo-600 hover:text-indigo-900"
          aria-label="Editar usuario"
          title="Editar usuario"
          type="button"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          className="text-red-600 hover:text-red-900"
          aria-label="Eliminar usuario"
          title="Eliminar usuario"
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          className="text-blue-600 hover:text-blue-800"
          aria-label="Enviar verificación"
          title="Enviar verificación"
          type="button"
        >
          <MailCheck className="w-4 h-4" />
        </button>
        <button
          className="text-green-600 hover:text-green-900"
          aria-label="Cambiar contraseña"
          title="Cambiar contraseña"
          type="button"
        >
          <KeyRound className="w-4 h-4" />
        </button>
        <button
          className="text-gray-500 hover:text-gray-800"
          aria-label="Ver más detalle"
          title="Ver más detalle"
          type="button"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </td>
  );
};
