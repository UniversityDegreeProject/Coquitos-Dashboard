import { memo } from "react";
import { Package, Tag } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductItemActions } from "./ProductItemActions";
import type { ProductResponse } from "../interfaces";

interface ProductCardProps {
  product: ProductResponse;
}

/**
 * Componente de tarjeta para mostrar información de un producto
 * Diseño extraordinario con glassmorphism, gradientes y animaciones fluidas
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  const { isDark } = useTheme();

  // Formatear precio en bolivianos
  const formatPrice = (price: number) => {
    return `Bs ${price.toLocaleString('es-BO')}`;
  };


  // Obtener color del estado para badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/50';
      case 'SinStock':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/50';
      case 'Descontinuado':
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/50';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50';
    }
  };

 
  return (
    <div className={`
      group relative overflow-hidden rounded-xl 
      ${isDark 
        ? 'bg-white/5 backdrop-blur-sm border border-white/10' 
        : 'bg-white/80 backdrop-blur-sm border border-gray-200/30'
      }
      shadow-lg hover:shadow-xl 
      transition-all duration-300 ease-out 
      transform hover:-translate-y-1
    `}>
      
      {/* Imagen del producto - más pequeña y alejada */}
      <div className="relative h-40 overflow-hidden">
        {product.image ? (
          <div className="relative w-full h-full p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className={`
              ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'} 
              rounded-lg p-4
            `}>
              <Package className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
        )}
        
        {/* Badge de estado minimalista */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(product.status)}`}>
            {product.status}
          </span>
        </div>
      </div>

      {/* Contenido principal - minimalista */}
      <div className="p-4">
        {/* Nombre del producto */}
        <h3 className={`text-lg font-semibold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {product.name}
        </h3>
        
        {/* Categoría */}
        <div className="flex items-center space-x-1 mb-3">
          <Tag className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {product.category?.name || 'Sin categoría'}
          </span>
        </div>

        {/* Precio y Stock - diseño minimalista */}
        <div className="flex items-center justify-between mb-4">
          {/* Precio */}
          <div className="flex items-center space-x-1">
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatPrice(product.price)}
            </span>
          </div>
          
          {/* Stock */}
          <div className="flex items-center space-x-1">
            <Package className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {product.stock || 0}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="mb-3">
          <ProductItemActions product={product} />
        </div>

        {/* SKU */}
        {product.sku && (
          <div className="flex items-center justify-between text-xs">
            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Código
            </span>
            <span className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {product.sku}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

