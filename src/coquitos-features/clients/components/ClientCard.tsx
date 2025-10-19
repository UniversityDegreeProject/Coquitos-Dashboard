import { memo } from "react";
import { Edit2, Trash2, Phone, Mail, MapPin, Star, Crown, ShoppingBag, DollarSign, Award } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Client } from "../interfaces";

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

/**
 * Componente de tarjeta para mostrar información de un cliente
 * Diseño elegante con avatar generado, estadísticas y badges de tipo
 */
export const ClientCard = memo(({ client, onEdit, onDelete }: ClientCardProps) => {
  const { isDark } = useTheme();

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generar avatar con iniciales
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Obtener color del avatar basado en el nombre
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-teal-500',
      'from-orange-400 to-red-500',
      'from-pink-400 to-rose-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-400 to-blue-500',
      'from-emerald-400 to-cyan-500',
      'from-violet-400 to-purple-500',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactivo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'Bloqueado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Obtener icono del tipo de cliente
  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'Cliente VIP':
        return <Crown className="w-3 h-3" />;
      case 'Empresa':
        return <Award className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  // Obtener color del tipo de cliente
  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'Cliente VIP':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Empresa':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  const avatarColor = getAvatarColor(client.name);
  const initials = getInitials(client.name);

  return (
    <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
      
      {/* Header con avatar y acciones */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${avatarColor} flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">
                {initials}
              </span>
            </div>
            {/* Indicador de estado */}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${isDark ? 'border-[#1E293B]' : 'border-white'} ${client.status === 'Activo' ? 'bg-green-500' : client.status === 'Bloqueado' ? 'bg-red-500' : 'bg-gray-400'}`} />
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onEdit && (
              <button
                onClick={() => onEdit(client)}
                className={`p-2 rounded-lg ${isDark ? 'bg-[#0F172A] hover:bg-[#1E293B]' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                aria-label="Editar cliente"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(client)}
                className={`p-2 rounded-lg ${isDark ? 'bg-[#0F172A] hover:bg-[#1E293B]' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                aria-label="Eliminar cliente"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        </div>

        {/* Nombre y documento */}
        <div className="mb-3">
          <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
            {client.name}
          </h3>
          <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
            {client.documentType || 'CC'}: {client.document}
          </p>
        </div>

        {/* Badges de estado y tipo */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
            {client.status}
          </span>
          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getClientTypeColor(client.clientType)}`}>
            {getClientTypeIcon(client.clientType)}
            <span className="ml-1">{client.clientType}</span>
          </span>
          {client.loyaltyPoints && client.loyaltyPoints > 0 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              <Star className="w-3 h-3 mr-1" />
              {client.loyaltyPoints} pts
            </span>
          )}
        </div>

        {/* Información de contacto */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Phone className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
            <span className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              {client.phone}
            </span>
          </div>
          {client.email && (
            <div className="flex items-center space-x-2">
              <Mail className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                {client.email}
              </span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center space-x-2">
              <MapPin className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                {client.address}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className={`px-6 pt-4 border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
        <div className="grid grid-cols-2 gap-4">
          {/* Órdenes */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <ShoppingBag className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Órdenes
              </span>
            </div>
            <p className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
              {client.totalOrders || 0}
            </p>
          </div>

          {/* Total gastado */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Total
              </span>
            </div>
            <p className={`text-lg font-bold text-green-600`}>
              {client.totalSpent ? formatPrice(client.totalSpent) : '$0'}
            </p>
          </div>
        </div>

        {/* Valor promedio por orden */}
        {client.averageOrderValue && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#334155]">
            <div className="flex items-center justify-between text-xs">
              <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Promedio por orden
              </span>
              <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                {formatPrice(client.averageOrderValue)}
              </span>
            </div>
          </div>
        )}

        {/* Última orden */}
        {client.lastOrderDate && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                Última orden
              </span>
              <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                {new Date(client.lastOrderDate).toLocaleDateString('es-CO')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  );
});
