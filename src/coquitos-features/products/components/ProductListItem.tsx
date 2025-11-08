import { memo } from "react";
import { Package, AlertTriangle } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductButtomsActions } from "./ProducButtomsActions";
import type { Product, SearchProductsParams } from "../interfaces";

interface ProductListItemProps {
  product: Product;
  currentParams: SearchProductsParams;
  onPageEmpty?: () => void;
}

export const ProductListItem = memo(({ product, currentParams, onPageEmpty }: ProductListItemProps) => {
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
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-lg font-semibold ${
                isDark ? 'text-[#F8FAFC]' : 'text-gray-800'
              }`}
            >
              {product.name}
            </h3>
            {/* Badge de stock bajo */}
            {product.stock <= product.minStock && product.status !== 'SinStock' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                Stock Bajo
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

