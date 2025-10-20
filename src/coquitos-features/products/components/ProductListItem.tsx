import { memo } from "react";
import { Package } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductItemActions } from "./ProductItemActions";
import type { ProductResponse } from "../interfaces";

interface ProductListItemProps {
  product: ProductResponse;
}

/**
 * Componente de item de producto en vista de lista
 * Optimizado con memoización para mejor performance
 */
export const ProductListItem = memo(({ product }: ProductListItemProps) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`${
        isDark ? 'bg-[#1E293B]' : 'bg-white'
      } rounded-xl shadow-lg border ${
        isDark ? 'border-[#334155]' : 'border-gray-100'
      } p-4 hover:shadow-xl transition-all duration-200`}
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
          <h3
            className={`text-lg font-semibold mb-1 ${
              isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
            }`}
          >
            {product.name}
          </h3>
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
        </div>

        {/* Precio */}
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
          <div
            className={`text-sm ${
              isDark ? 'text-[#94A3B8]' : 'text-gray-500'
            }`}
          >
            Stock: {product.stock || 0}
          </div>
        </div>

        {/* Acciones */}
        <ProductItemActions product={product} />
      </div>
    </div>
  );
});

