import { memo, useMemo } from "react";
import { UserCheck } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Client } from "../interfaces";
import { getClientTypeColor } from "../helpers";
import { ClientButtomActions } from "./ClientButtomActions";

interface ClientListProps{
  client : Client;
}

/**
 * Componente reutilizable para cada item de usuario en la lista
 * Muestra información completa con acciones integradas
 */
export const ClientList = memo(({ client }: ClientListProps) => {
  const { isDark } = useTheme();

  // Detectar si es una mutación optimista
  const isOptimistic = false /* client.isOptimisti*/

  const formattedCreatedAt = useMemo(() =>{

    if( !client.createdAt) return "Nunca"

    const date = new Date(client.createdAt).toLocaleDateString("es-ES",{
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return date;
  },[client.createdAt])

  // * TODO: Acer las funciones de fecha
  return (
    <div
      className={`${
        isDark ? 'bg-[#1E293B]' : 'bg-white'
      } rounded-xl shadow-lg border ${
        isDark ? 'border-[#334155]' : 'border-gray-100'
      } p-4 hover:shadow-xl transition-all duration-200 ${
        isOptimistic ? 'animate-pulse opacity-60' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <UserCheck className="w-6 h-6 text-white" />
        </div>

        {/* Información principal */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
            }`}
          >
            {client.firstName} {client.lastName}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <p
              className={`${
                isDark ? 'text-[#94A3B8]' : 'text-gray-600'
              }`}
            >
              {client.phone}
            </p>
            <span className={isDark ? 'text-[#64748B]' : 'text-gray-400'}>•</span>
            <p
              className={`${
                isDark ? 'text-[#94A3B8]' : 'text-gray-600'
              } truncate`}
            >
              {client.email}
            </p>
          </div>
        </div>

        {/* Tipo de cliente */}
        <div className="flex-shrink-0">
          <span
            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getClientTypeColor(
              client.type
            )}`}
          >
            {client.type}
          </span>
        </div>


        {/* Cliente desde */}
        <div className="flex-shrink-0 text-right min-w-[140px]">
          <p
            className={`text-xs ${
              isDark ? 'text-[#64748B]' : 'text-gray-400'
            }`}
          >
            Cliente desde
          </p>
          <p
            className={`text-sm ${
              isDark ? 'text-[#94A3B8]' : 'text-gray-500'
            }`}
          >
            {formattedCreatedAt}
          </p>
        </div>

        {/* Acciones */}
        <ClientButtomActions client={client} />
      </div>
    </div>
  );
});

