import { memo, useMemo } from "react";
import { User, Phone, MapPin } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Client, SearchClientsParams } from "../interfaces";
import { formatDatetime, getClientTypeColor } from "../helpers";
import { ClientButtomActions } from "./ClientButtomActions";
import { cn } from "@/lib/utils";

interface ClientListItemProps {
  client: Client;
  currentParams: SearchClientsParams;
  onPageEmpty?: () => void;
}
/**
 * Componente reutilizable para cada item de cliente en la lista
 * Muestra información completa con acciones integradas
 */
export const ClientListItem = memo(({ client, currentParams, onPageEmpty }: ClientListItemProps) => {
  const { isDark } = useTheme();

  const formattedCreatedAt = useMemo(() => {
    if (!client.createdAt) return "Sin registro";
    return formatDatetime(client.createdAt);
  }, [client.createdAt]);

  return (
    <div
      className={cn(
        'rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200',
        isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-100'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:space-x-4">
        {/* Sección izquierda: Avatar + Info principal */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold mb-1 ${
                isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
              }`}
            >
              {client.firstName} {client.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                {client.email}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Phone className={`w-3.5 h-3.5 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                  {client.phone}
                </span>
              </div>
              <span className={isDark ? 'text-[#64748B]' : 'text-gray-400'}>•</span>
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                  {client.address}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:hidden">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClientTypeColor(client.type)}`}>
                {client.type}
              </span>
            </div>
          </div>
        </div>

        {/* Sección del medio: Tag tipo de cliente */}
        <div className="hidden sm:flex items-center flex-shrink-0 self-center">
          <span className={`inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full ${getClientTypeColor(client.type)}`}>
            {client.type}
          </span>
        </div>

        {/* Sección derecha: Fecha y acciones */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0 self-center">
          <div className="flex-shrink-0 text-right min-w-[140px]">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Fecha de registro
            </p>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedCreatedAt}
            </p>
          </div>

          <ClientButtomActions client={client} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>

        {/* Móvil */}
        <div className="flex sm:hidden items-center justify-between pt-2 border-t border-gray-200 dark:border-[#334155]">
          <div className="text-left">
            <p className={`text-xs ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>
              Fecha de registro
            </p>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {formattedCreatedAt}
            </p>
          </div>
          <ClientButtomActions client={client} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>
      </div>
    </div>
  );
});

