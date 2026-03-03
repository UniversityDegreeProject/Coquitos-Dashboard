import { memo } from "react";
import { Search, Package, Loader2 } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/coquitos-features/products/interfaces";

interface ProductSearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

/**
 * Sección de búsqueda y listado de productos
 * Con scroll independiente para el grid de productos
 */
export const ProductSearchSection = memo(({ 
  searchTerm, 
  onSearchChange, 
  products, 
  isLoading, 
  onAddToCart 
}: ProductSearchSectionProps) => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col space-y-4">
      {/* Buscador de productos */}
      <div className="relative flex-shrink-0">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} z-10`} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar productos..."
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-400 focus:border-[#F59E0B]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#275081]'} focus:ring-2 ring-offset-1 ${isDark ? 'focus:ring-[#F59E0B]/20' : 'focus:ring-[#275081]/20'} outline-none transition-all duration-200`}
        />
      </div>

      {/* Grid de productos */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Package className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No se encontraron productos disponibles
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
});

