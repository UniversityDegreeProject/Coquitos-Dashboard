import { memo } from "react";
import { Package, Weight, Clock } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "../helpers";
import { formatExpirationDate, getDaysUntilExpiration, getNearestExpirationDate } from "@/coquitos-features/products/helpers";
import type { Product } from "@/coquitos-features/products/interfaces";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

/**
 * Tarjeta de producto para el modal de ventas
 * Muestra imagen, nombre, precio y stock
 */
export const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
  const { isDark } = useTheme();
  
  // Obtener fecha de vencimiento más cercana
  const nearestExpirationDate = getNearestExpirationDate(product);
  const daysUntilExpiration = getDaysUntilExpiration(nearestExpirationDate as Date | string);
  const isNearExpiration = daysUntilExpiration !== null && daysUntilExpiration <= 4 && daysUntilExpiration >= 0;

  return (
    <button
      onClick={() => onAddToCart(product)}
      type="button"
      className={`group relative overflow-hidden rounded-xl border ${isDark ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#334155] hover:border-[#F59E0B]' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-[#275081]'} p-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer`}
    >
      {/* Imagen */}
      <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-[#0F172A]' : 'bg-gray-100'}`}>
            <Package className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
        )}
        
        {/* Badge de peso variable */}
        {product.isVariableWeight && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Weight className="w-3 h-3" />
            Peso Variable
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className={`font-semibold text-sm mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {product.name}
      </h3>
      <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {product.category?.name}
      </p>
      
      {/* Precio */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-lg font-bold ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
          {product.isVariableWeight 
            ? `${formatCurrency(product.pricePerKg || 0)}/kg` 
            : formatCurrency(product.price)
          }
        </span>
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          Stock: {product.stock}
        </span>
      </div>
      
      {/* Fecha de vencimiento */}
      {nearestExpirationDate && (
        <div className={`flex items-center gap-1 text-xs ${isNearExpiration ? 'text-red-500 font-semibold' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <Clock className="w-3 h-3" />
          <span>
            Vence: {formatExpirationDate(nearestExpirationDate)}
            {daysUntilExpiration !== null && (
              <span className={isNearExpiration ? ' text-red-500 font-bold ml-1' : ''}>
                {daysUntilExpiration === 0 
                  ? ' (Hoy)' 
                  : daysUntilExpiration === 1 
                  ? ' (Mañana)' 
                  : ` (${daysUntilExpiration} días)`
                }
              </span>
            )}
          </span>
        </div>
      )}

      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  );
});

