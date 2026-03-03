import { memo } from "react";
import { Package, AlertTriangle, Clock, Layers } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductButtomsActions } from "./ProducButtomsActions";
import { isProductNearExpiration, getDaysUntilExpiration, getNearestExpirationDate, formatExpirationDate } from "../helpers";
import type { Product, SearchProductsParams } from "../interfaces";

interface ProductListItemProps {
  product: Product;
  currentParams: SearchProductsParams;
  onPageEmpty?: () => void;
}

export const ProductListItem = memo(({ product, currentParams, onPageEmpty }: ProductListItemProps) => {
  const { isDark } = useTheme();

  // Determinar el estado real del producto (si stock = 0, forzar "SinStock")
  const getEffectiveStatus = (product: Product): string => {
    // Si el stock es 0, el estado debe ser "SinStock" independientemente del status del backend
    if (product.stock === 0) {
      return 'SinStock';
    }
    return product.status;
  };

  const effectiveStatus = getEffectiveStatus(product);
  
  // Verificar si el producto está próximo a vencer
  const isNearExpiration = isProductNearExpiration(product);
  const nearestExpirationDate = getNearestExpirationDate(product);
  const daysUntilExpiration = getDaysUntilExpiration(nearestExpirationDate as Date | string);

  return (
    <div
      className={`${
        isDark ? 'bg-[#1E293B]' : 'bg-white'
      } rounded-xl shadow-sm border ${
        isDark ? 'border-[#334155]' : 'border-gray-100'
      } p-4 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center space-x-4">
        {/* Imagen */}
        <div
          className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(45deg, #1E293B 25%, #0F172A 25%, #0F172A 50%, #1E293B 50%, #1E293B 75%, #0F172A 75%, #0F172A)'
              : 'linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%, #e5e7eb)',
            backgroundSize: '10px 10px',
          }}
        >
          {product.image ? (
            <div className="w-full h-full flex items-center justify-center p-1">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package
                className={`w-6 h-6 ${
                  isDark ? 'text-[#64748B]' : 'text-gray-400'
                }`}
              />
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3
              className={`text-lg font-semibold ${
                isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
              }`}
            >
              {product.name}
            </h3>
            {/* Badge de producto variable - solo para productos con gestión por lotes */}
            {product.isVariableWeight && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
                <Layers className="w-3 h-3" />
                Por Lotes
              </span>
            )}
            {/* Badge de estado */}
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ${
              effectiveStatus === 'Disponible' 
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm'
                : effectiveStatus === 'SinStock'
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm'
                : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-sm'
            }`}>
              {effectiveStatus === 'SinStock' ? 'Sin Stock' : effectiveStatus}
            </span>
            {/* Badge de stock bajo - solo mostrar si stock > 0 y stock <= minStock */}
            {product.stock > 0 && product.stock <= product.minStock && effectiveStatus !== 'SinStock' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                Stock Bajo
              </span>
            )}
            {/* Badge de próximo a vencer - mostrar si faltan 4, 3 o 2 días */}
            {isNearExpiration && product.stock > 0 && effectiveStatus !== 'SinStock' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm animate-pulse">
                <Clock className="w-3 h-3" />
                Próximo a vencer
              </span>
            )}
            
            {/* Badge de vence mañana - mostrar solo si falta 1 día */}
            {daysUntilExpiration === 1 && product.stock > 0 && effectiveStatus !== 'SinStock' && !isNearExpiration && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm animate-pulse">
                <Clock className="w-3 h-3" />
                Vence Mañana
              </span>
            )}
            
            {/* Badge de vence hoy - mostrar solo si es el día exacto */}
            {daysUntilExpiration === 0 && product.stock > 0 && effectiveStatus !== 'SinStock' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-red-600 to-red-800 text-white shadow-sm animate-pulse">
                <Clock className="w-3 h-3" />
                Vence Hoy
              </span>
            )}
          </div>
          <p
            className={`text-sm ${
              isDark ? 'text-[#94A3B8]' : 'text-gray-600'
            } truncate`}
          >
            {product.category?.name || 'Sin categoría'}
          </p>
          {product.description && (
            <p
              className={`text-sm ${
                isDark ? 'text-[#94A3B8]' : 'text-gray-600'
              } line-clamp-1`}
            >
              {product.description}
            </p>
          )}
          {/* Fecha de Vencimiento - siempre mostrar la fecha original */}
          {nearestExpirationDate && (
            <div className={`flex items-center gap-1.5 mt-1 text-xs ${
              daysUntilExpiration === 0 
                ? 'text-red-600 font-semibold' 
                : daysUntilExpiration === 1 
                ? 'text-orange-500 font-semibold'
                : isNearExpiration 
                ? 'text-red-500 font-semibold' 
                : isDark 
                ? 'text-gray-400' 
                : 'text-gray-600'
            }`}>
              <Clock className={`w-3 h-3 ${
                daysUntilExpiration === 0 
                  ? 'text-red-600' 
                  : daysUntilExpiration === 1 
                  ? 'text-orange-500'
                  : isNearExpiration 
                  ? 'text-red-500' 
                  : ''
              }`} />
              <span>
                Vence: {formatExpirationDate(nearestExpirationDate)}
                {daysUntilExpiration !== null && daysUntilExpiration <= 1 && (
                  <span className={`ml-1 font-bold ${
                    daysUntilExpiration === 0 
                      ? 'text-red-600' 
                      : 'text-orange-500'
                  }`}>
                    {daysUntilExpiration === 0 ? '(Hoy)' : '(Mañana)'}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Precio y Stock */}
        <div className="text-right">
          <div
            className={`text-lg font-bold ${
              isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
            }`}
          >
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(product.price)}
          </div>
          <div className="mt-1">
            <span className={`text-[10px] font-medium uppercase block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Stock
            </span>
            <span
              className={`text-sm font-semibold ${
                isDark ? 'text-[#94A3B8]' : 'text-gray-600'
              }`}
            >
              {product.stock || 0}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <ProductButtomsActions product={product} currentParams={currentParams} onPageEmpty={onPageEmpty} />
      </div>
    </div>
  );
});

