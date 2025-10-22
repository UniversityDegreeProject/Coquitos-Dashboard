import { memo } from 'react';
import { User, Phone, Mail, MapPin, FileText, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from "@/shared/hooks/useTheme";
import { getStatusColor, getDocumentTypeLabel, formatPhone } from '../helpers';
import type { ClientResponse } from '../interfaces';

interface ClientCardProps {
  client: ClientResponse;
  onEdit?: (client: ClientResponse) => void;
  onDelete?: (client: ClientResponse) => void;
}

/**
 * Tarjeta de cliente con diseño moderno y glassmorphism
 */
export const ClientCard = memo(({ client, onEdit, onDelete }: ClientCardProps) => {
  const { colors, isDark } = useTheme();

  const handleEdit = () => {
    onEdit?.(client);
  };

  const handleDelete = () => {
    onDelete?.(client);
  };

  return (
    <div className={`
      group relative overflow-hidden rounded-2xl 
      ${isDark 
        ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20' 
        : 'bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95 backdrop-blur-xl border border-gray-200/50'
      }
      shadow-2xl hover:shadow-3xl 
      transition-all duration-500 ease-out 
      transform hover:-translate-y-2 hover:scale-[1.02]
      hover:border-white/30
      before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full before:group-hover:translate-x-full before:transition-transform before:duration-1000 before:ease-out
    `}>
      
      {/* Contenido principal */}
      <div className="relative p-6">
        {/* Header con nombre y estado */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <User className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${colors.text.primary}`}>
                {client.name}
              </h3>
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>
          </div>
          
          {/* Acciones */}
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
                aria-label="Editar cliente"
                title="Editar cliente"
              >
                <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Eliminar cliente"
                title="Eliminar cliente"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        </div>

        {/* Información del cliente */}
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className={`w-4 h-4 ${colors.text.muted}`} />
            <span className={`text-sm ${colors.text.primary}`}>{client.email}</span>
          </div>

          {/* Teléfono */}
          <div className="flex items-center space-x-3">
            <Phone className={`w-4 h-4 ${colors.text.muted}`} />
            <span className={`text-sm ${colors.text.primary}`}>{formatPhone(client.phone)}</span>
          </div>

          {/* Documento */}
          <div className="flex items-center space-x-3">
            <FileText className={`w-4 h-4 ${colors.text.muted}`} />
            <span className={`text-sm ${colors.text.primary}`}>
              {getDocumentTypeLabel(client.documentType)}: {client.documentNumber}
            </span>
          </div>

          {/* Dirección */}
          {client.address && (
            <div className="flex items-start space-x-3">
              <MapPin className={`w-4 h-4 mt-0.5 ${colors.text.muted}`} />
              <span className={`text-sm ${colors.text.primary}`}>{client.address}</span>
            </div>
          )}

          {/* Notas */}
          {client.notes && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className={`text-sm ${colors.text.muted} italic`}>
                "{client.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Fecha de creación */}
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${colors.text.muted}`}>
            Creado: {new Date(client.createdAt).toLocaleDateString('es-CO')}
          </p>
        </div>
      </div>

      {/* Efecto de borde con gradiente dinámico */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${client.status === 'Activo' ? 'from-green-500 via-gray-500 to-teal-500' : 'from-red-500 via-gray-500 to-pink-500'} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Efecto de brillo en las esquinas */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/15 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
});