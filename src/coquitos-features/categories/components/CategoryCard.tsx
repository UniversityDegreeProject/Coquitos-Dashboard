import { memo } from "react";
import { Edit2, Trash2, Package } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Category } from "../interfaces";

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

/**
 * Componente de tarjeta para mostrar información de una categoría
 * Diseño elegante con gradientes y efectos hover
 */
export const CategoryCard = memo(({ category, onEdit, onDelete }: CategoryCardProps) => {
  const { isDark } = useTheme();

  // Colores dinámicos basados en el nombre de la categoría
  const getCategoryColor = (name: string) => {
    const colors = [
      'from-orange-400 to-red-500',
      'from-blue-400 to-purple-500',
      'from-green-400 to-teal-500',
      'from-pink-400 to-rose-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-400 to-blue-500',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const categoryColor = getCategoryColor(category.name);

  return (
    <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
      {/* Gradiente superior */}
      <div className={`h-2 bg-gradient-to-r ${categoryColor}`} />
      
      {/* Contenido principal */}
      <div className="p-6">
        {/* Header con acciones */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${categoryColor} transition-all duration-300`}>
              {category.name}
            </h3>
            <div className={`flex items-center space-x-2 mb-3`}>
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryColor} shadow-sm`} />
              <span className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                {category.status}
              </span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onEdit && (
              <button
                onClick={() => onEdit(category)}
                className={`p-2 rounded-lg ${isDark ? 'bg-[#0F172A] hover:bg-[#1E293B]' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                aria-label="Editar categoría"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(category)}
                className={`p-2 rounded-lg ${isDark ? 'bg-[#0F172A] hover:bg-[#1E293B]' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                aria-label="Eliminar categoría"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          {category.description || 'Sin descripción'}
        </p>

        {/* Footer con conteo de productos */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#334155]">
          <div className="flex items-center space-x-2">
            <Package className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
              {category.productCount || 0} productos
            </span>
          </div>
          
          {/* Indicador de estado con animación */}
          <div className="relative">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryColor} shadow-sm`} />
            <div className={`absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r ${categoryColor} animate-ping opacity-20`} />
          </div>
        </div>
      </div>

      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  );
});
