import { memo } from "react";
import { Package, Tag, Clock, Layers } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductButtomsActions } from "./ProducButtomsActions";
import { isProductNearExpiration, getDaysUntilExpiration, getNearestExpirationDate, formatExpirationDate } from "../helpers";
import type { Product, SearchProductsParams } from "../interfaces";

interface ProductCardProps {
  product: Product;
  currentParams: SearchProductsParams;
  onPageEmpty?: () => void;
}

/**
 * Componente de tarjeta para mostrar información de un producto
 * Diseño extraordinario con glassmorphism, gradientes y animaciones fluidas
 */
export const ProductCard = memo(({ product, currentParams, onPageEmpty }: ProductCardProps) => {
  const { isDark } = useTheme();

  // Formatear precio en bolivianos
  const formatPrice = (price: number) => {
    return `Bs ${price.toLocaleString('es-BO')}`;
  };

  // Obtener gradiente dinámico basado en el estado
  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'from-emerald-500 via-gray-500 to-teal-500';
      case 'SinStock':
        return 'from-red-500 via-gray-500 to-pink-500';
      case 'Descontinuado':
        return 'from-gray-500 via-gray-500 to-zinc-500';
      default:
        return 'from-blue-500 via-gray-500 to-purple-500';
    }
  };


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

  // Obtener color del estado para badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm shadow-emerald-500/50';
      case 'SinStock':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm shadow-red-500/50';
      case 'Descontinuado':
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-sm shadow-gray-500/50';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/50';
    }
  };

 
  return (
    <div className={`
      group relative overflow-hidden rounded-2xl 
      ${isDark 
        ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/80 to-black/90 border border-white/20' 
        : 'bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95 border border-gray-200/50'
      }
      shadow-2xl hover:shadow-3xl 
      transition-all duration-500 ease-out 
      transform hover:-translate-y-2 hover:scale-[1.02]
      hover:border-white/30
      before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full before:group-hover:translate-x-full before:transition-transform before:duration-1000 before:ease-out
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
        
        {/* Badges en la esquina superior derecha */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {/* Badge de estado */}
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(effectiveStatus)}`}>
            {effectiveStatus === 'SinStock' ? 'Sin Stock' : effectiveStatus}
          </span>
          
          {/* Badge de stock bajo - solo mostrar si stock > 0 y stock <= minStock */}
          {product.stock > 0 && product.stock <= product.minStock && effectiveStatus !== 'SinStock' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm shadow-yellow-500/50 animate-pulse">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Stock Bajo
            </span>
          )}
          
          {/* Badge de próximo a vencer - mostrar si faltan 4, 3 o 2 días */}
          {isNearExpiration && product.stock > 0 && effectiveStatus !== 'SinStock' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm shadow-red-500/50 animate-pulse">
              <Clock className="w-3 h-3" />
              Próximo a vencer
            </span>
          )}
          
          {/* Badge de vence mañana - mostrar solo si falta 1 día */}
          {daysUntilExpiration === 1 && product.stock > 0 && effectiveStatus !== 'SinStock' && !isNearExpiration && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm shadow-orange-500/50 animate-pulse">
              <Clock className="w-3 h-3" />
              Vence Mañana
            </span>
          )}
          
          {/* Badge de vence hoy - mostrar solo si es el día exacto */}
          {daysUntilExpiration === 0 && product.stock > 0 && effectiveStatus !== 'SinStock' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-red-600 to-red-800 text-white shadow-sm shadow-red-600/50 animate-pulse">
              <Clock className="w-3 h-3" />
              Vence Hoy
            </span>
          )}
        </div>
      </div>

      {/* Contenido principal - minimalista */}
      <div className="p-4">
        {/* Nombre del producto y tipo */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`text-lg font-semibold line-clamp-1 flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </h3>
          {/* Badge de producto variable - solo para productos con gestión por lotes */}
          {product.isVariableWeight && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm flex-shrink-0">
              <Layers className="w-3 h-3" />
              Por Lotes
            </span>
          )}
        </div>
        
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
          <div className="flex flex-col">
            {product.isVariableWeight ? (
              <>
                {/* Producto variable: calcular total desde batches si están disponibles */}
                {(() => {
                  // Calcular precio total desde batches si están disponibles
                  let calculatedTotal = 0;
                  
                  if (product.batches && product.batches.length > 0) {
                    // Sumar unitPrice * stock de cada batch
                    calculatedTotal = product.batches.reduce((sum, batch) => {
                      const unitPrice = Number(batch.unitPrice) || 0;
                      const stock = Number(batch.stock) || 0;
                      return sum + (unitPrice * stock);
                    }, 0);
                  } else {
                    // Si no hay batches, usar el precio del producto como fallback
                    calculatedTotal = Number(product.price) || 0;
                  }
                  
                  return (
                    <>
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Total:
                        </span>
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatPrice(calculatedTotal)}
                        </span>
                      </div>
                      {product.pricePerKg && (
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Precio:
                          </span>
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatPrice(product.pricePerKg)}
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                {/* Producto normal: mostrar total (precio * stock) y precio unitario */}
                <div className="flex items-center space-x-1">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total:
                  </span>
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(product.price * (product.stock || 0))}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Precio:
                  </span>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              </>
            )}
          </div>
          
          {/* Stock */}
          <div className="flex flex-col items-end">
            <span className={`text-[10px] font-medium uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Stock
            </span>
            <div className="flex items-center space-x-1">
              <Package className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {product.stock || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mb-3">
          <ProductButtomsActions product={product} currentParams={currentParams} onPageEmpty={onPageEmpty} />
        </div>

        {/* SKU */}
        {product.sku && (
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Código
            </span>
            <span className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {product.sku}
            </span>
          </div>
        )}
        
        {/* Fecha de Vencimiento - siempre mostrar la fecha original */}
        {nearestExpirationDate && (
          <div className={`flex items-center gap-1.5 text-xs ${
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
            <Clock className={`w-3.5 h-3.5 ${
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

      {/* Efecto de borde con gradiente dinámico */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getStatusGradient(effectiveStatus)} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Efecto de brillo en las esquinas */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/15 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
});

