import { useState, useCallback } from 'react';
import { Package, Plus } from 'lucide-react';
import { ProductSearchPage, ProductGrid, ProductStats, FormProductModal } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { useGetProducts } from "../hooks";
import { useProductStore } from "../store/product.store";
import { useShallow } from "zustand/shallow";
import type { ProductStatus } from "../interfaces";
import { FormStockMovementModal } from "@/coquitos-features/stock-movements/components";
import { useStockMovementStore } from "@/coquitos-features/stock-movements/store/stock-movement.store";

/**
 * Página principal de gestión de productos
 * Implementa búsqueda, filtros y CRUD completo siguiendo el patrón de users
 */
export const ProductPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // * Zustand - Optimizado con selectores específicos
  const modalMode = useProductStore(useShallow((state) => state.modalMode));
  const viewMode = useProductStore(useShallow((state) => state.viewMode));
  const setViewMode = useProductStore(useShallow((state) => state.setViewMode));
  const setOpenModalCreate = useProductStore(useShallow((state) => state.setOpenModalCreate));
  
  // * Stock Movement Modal
  const isStockModalOpen = useStockMovementStore(useShallow((state) => state.isModalOpen));

  // * TanStack Query
  const { data: products = [], isLoading } = useGetProducts();

  // * Theme
  const { colors, isDark } = useTheme();

  // * Filtrar productos basado en los filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         product.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // * Memoizar el callback del botón
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Package className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Gestión de Productos
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus className="w-5 h-5 mr-2 text-[#2309095c]" />
          <span className="text-[#08080865] font-bold">Agregar Producto</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <ProductStats products={products} />

      {/* Search and Filters */}
      <ProductSearchPage
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Products Grid */}
      <ProductGrid 
        products={filteredProducts}
        viewMode={viewMode}
        isLoading={isLoading}
      />

      {/* Create Product Modal */}
      {modalMode === 'create' && (
        <FormProductModal />
      )}
      {/* Update Product Modal */}
      {modalMode === 'update' && (
        <FormProductModal />
      )}
      
      {/* Stock Movement Modal */}
      {isStockModalOpen && (
        <FormStockMovementModal />
      )}
    </div>
  );
};
