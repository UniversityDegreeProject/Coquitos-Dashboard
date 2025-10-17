import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductCard } from "./ProductCard";
import type { Product } from "../interfaces";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

/**
 * Grid responsivo para mostrar productos
 * Soporta vista de grid y lista con estado de carga
 */
export const ProductGrid = memo(({ 
  products, 
  isLoading = false, 
  onEdit, 
  onDelete,
  viewMode = 'grid'
}: ProductGridProps) => {
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
        {[...Array(8)].map((_, index) => (
          viewMode === 'grid' ? (
            <div
              key={index}
              className={`animate-pulse rounded-xl shadow-lg ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}
            >
              {/* Imagen */}
              <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-t-xl" />
              
              {/* Contenido */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
                
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#334155]">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
              </div>
            </div>
          ) : (
            <div
              key={index}
              className={`animate-pulse rounded-xl shadow-lg ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-4`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          )
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-12 text-center`}>
        <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${isDark ? 'bg-[#0F172A]' : 'bg-gray-100'} flex items-center justify-center`}>
          <svg className={`w-12 h-12 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
          No hay productos
        </h3>
        <p className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Comienza agregando tu primer producto
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-4 hover:shadow-xl transition-all duration-200`}
          >
            <div className="flex items-center space-x-4">
              {/* Imagen */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${isDark ? 'bg-[#0F172A]' : 'bg-gray-100'} flex items-center justify-center`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                  {product.name}
                </h3>
                <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} truncate`}>
                  {product.category}
                </p>
                {product.description && (
                  <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'} line-clamp-1`}>
                    {product.description}
                  </p>
                )}
              </div>

              {/* Precio */}
              <div className="text-right">
                <div className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  }).format(product.price)}
                </div>
                <div className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                  Stock: {product.stock || 0}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label="Editar producto"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(product)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});
