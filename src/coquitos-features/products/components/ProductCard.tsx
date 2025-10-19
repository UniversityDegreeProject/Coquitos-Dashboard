import { memo } from "react";
import { Package, DollarSign, Tag, AlertTriangle } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductItemActions } from "./ProductItemActions";
import type { ProductResponse } from "../interfaces";

interface ProductCardProps {
  product: ProductResponse;
}

/**
 * Componente de tarjeta para mostrar información de un producto
 * Diseño elegante con imagen, precio y estado destacado
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  const { isDark } = useTheme();

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'SinStock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Descontinuado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Verificar si está agotado
  const isOutOfStock = product.stock === 0 || product.status === 'SinStock';
 
  return (
    <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
      
      {/* Imagen del producto */}
      <div className="relative h-48 overflow-hidden"
        style={{
          backgroundImage: isDark 
            ? 'linear-gradient(45deg, #1E293B 25%, #0F172A 25%, #0F172A 50%, #1E293B 50%, #1E293B 75%, #0F172A 75%, #0F172A)'
            : 'linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%, #e5e7eb)',
          backgroundSize: '20px 20px'
        }}>
        {product.image ? (
          <div className="w-full h-full flex items-center justify-center p-2">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center`}>
            <div className={`${isDark ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-sm rounded-xl p-4`}>
              <Package className={`w-12 h-12 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
            </div>
          </div>
        )}
        

        {/* Badge de agotado */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-lg">
              <AlertTriangle className="w-3 h-3" />
              <span>Agotado</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Header con nombre y estado */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 line-clamp-1 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
              {product.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
          </div>
        </div>

        {/* Categoría */}
        <div className="flex items-center space-x-2 mb-3">
          <Tag className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
            {product.category?.name || 'Sin categoría'}
          </span>
        </div>

        {/* Descripción */}
        {product.description && (
          <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
            {product.description}
          </p>
        )}

        {/* Footer con precio, stock y acciones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#334155]">
            <div className="flex items-center space-x-2">
              <DollarSign className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
              <span className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                {formatPrice(product.price)}
              </span>
            </div>
            
            {/* Stock */}
            <div className="flex items-center space-x-2">
              <Package className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                {product.stock || 0}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end">
            <ProductItemActions product={product} />
          </div>
        </div>

        {/* Información adicional si está disponible */}
        {product.sku && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#334155]">
            <div className="flex items-center justify-between text-xs">
              <span className={`${isDark ? 'text-[#64748B]' : 'text-gray-500'}`}>
                Código: {product.sku}
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
