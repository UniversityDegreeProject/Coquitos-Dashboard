import { useState, useCallback } from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { ProductSearchPage, ProductGrid, ProductButtonsActions, FormProductModal } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { useGetProducts, useDeleteProduct } from "../hooks";
import { useProductStore } from "../store/product.store";
import { useShallow } from "zustand/shallow";
import type { ProductStatus, ProductResponse } from "../interfaces";
import Swal from 'sweetalert2';

export const ProductPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // * Theme
  const { colors, isDark } = useTheme();

  // * Zustand Store
  const modalMode = useProductStore(useShallow((state) => state.modalMode));
  const viewMode = useProductStore(useShallow((state) => state.viewMode));
  const setViewMode = useProductStore(useShallow((state) => state.setViewMode));
  const setOpenModalUpdate = useProductStore(useShallow((state) => state.setOpenModalUpdate));

  // * TanStack Query
  const { data: products = [], isLoading } = useGetProducts();
  const { deleteProductMutation } = useDeleteProduct();

  // * Filtrar productos basado en los filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         product.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // * Handlers para acciones
  const handleEditProduct = useCallback((product: ProductResponse) => {
    setOpenModalUpdate(product);
  }, [setOpenModalUpdate]);

  const handleDeleteProduct = useCallback((product: ProductResponse) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-xl',
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductMutation.mutate(product.id);
      }
    });
  }, [deleteProductMutation]);

  // * Estadísticas rápidas
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.status === 'Disponible').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

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
        <ProductButtonsActions 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Total Productos
              </p>
              <p className={`text-2xl font-bold ${colors.text.primary}`}>
                {totalProducts}
              </p>
            </div>
            <Package className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Disponibles
              </p>
              <p className={`text-2xl font-bold text-green-600`}>
                {availableProducts}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 text-green-600`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Stock Bajo
              </p>
              <p className={`text-2xl font-bold text-red-600`}>
                {lowStockProducts}
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 text-red-600`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Valor Total
              </p>
              <p className={`text-lg font-bold ${colors.text.primary}`}>
                Bs. {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 0 }).format(totalValue)}
              </p>
            </div>
            <DollarSign className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
        </div>
      </div>

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
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Modal */}
      {modalMode && (
        <FormProductModal />
      )}
    </div>
  );
};
