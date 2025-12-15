import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Plus, ClipboardList, Package} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useIsMutating } from '@tanstack/react-query';
import { ProductGrid, ProductStats, FormProductModal, ProductPagination, ProductSearchPage, ProductToggleFromGridToList } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { useGetProducts, useProductsStats } from "../hooks";
import { useProductStore } from "../store/product.store";
import { useShallow } from "zustand/shallow";
import type { SearchProductsParams } from "../interfaces";
import { FormStockMovementModal } from "@/coquitos-features/stock-movements/components";
import { useStockMovementStore } from "@/coquitos-features/stock-movements/store/stock-movement.store";
import { paths } from "@/router/paths";
import type { SearchProductsSchema} from '../schemas';
import type { ProductStatus } from '../interfaces';
import { useGetCategories } from "@/coquitos-features/categories/hooks/useGetCategories";


const filtersDefault : SearchProductsSchema = {
  search: "",
  categoryId: "",
  status: "",
  lowStock: false,
  nearExpiration: false,
  page: 1,
  limit: 4
}
export const ProductPage = () => {
  // * Estados locales para filtros
  const [ page, setPage ] = useState<number>(1);
  const [ limit, setLimit ] = useState<number>(4);
  const [searchFilters, setSearchFilters] = useState<SearchProductsSchema>(filtersDefault);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchFilters.search, 500);
  const debouncedCategoryId = useDebounce(searchFilters.categoryId, 500);
  const debouncedStatus = useDebounce(searchFilters.status, 500);

  // * Theme
  const { colors, isDark } = useTheme();

  // * Zustand - Optimizado con selectores específicos
  const modalMode = useProductStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useProductStore(useShallow((state) => state.setOpenModalCreate));


  // * Stock Movement Modal
  const isStockModalOpen = useStockMovementStore(useShallow((state) => state.isModalOpen));
  
  // * Navigation
  const navigate = useNavigate();

  // * Params of search
  const currentParams: SearchProductsParams = useMemo(() => ({
    search: debouncedSearch,
    categoryId: debouncedCategoryId,
    status: searchFilters.status,
    lowStock: searchFilters.lowStock,
    nearExpiration: searchFilters.nearExpiration,
    page: page,
    limit: limit
  }), [debouncedSearch, debouncedCategoryId, searchFilters.status, searchFilters.lowStock, searchFilters.nearExpiration, page, limit]);

  // * TanStack Query

  const {
    products,
    total,
    page:
    currentPage,
    limit:
    currentLimit,
    totalPages,
    nextPage,
    previousPage,
    isLoading,
    isFetching 
  } = useGetProducts(currentParams);

    // * Hook para estadísticas globales (todos los usuarios, no solo la página actual)

  const { productsStats } = useProductsStats({
    search: debouncedSearch,
    categoryId: debouncedCategoryId,
    status: searchFilters.status,
  });

  // * Detectar mutaciones CRUD activas (create, update, delete)
  const isMutating = useIsMutating() > 0;

  // * Obtener categorías para el filtro
  const { categories, isLoading: isLoadingCategories } = useGetCategories({
    search: "",
    status: "",
    page: 1,
    limit: 100
  });

  // * Memoizar callbacks
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);

  const handleNavigateToStockMovements = useCallback(() => {
    navigate(paths.dashboard.stockMovements);
  }, [navigate]);


  // * Handler cuando cambian los filtros del buscador
  const handleSearchFiltersChange = useCallback((values: SearchProductsSchema) => {
    setSearchFilters(values);
  }, []);

  // * Callback cuando una página queda vacía después de eliminar
  const handlePageEmpty = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // * Callback cuando cambia el límite de la página
  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // * Callback cuando cambia la página
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // * Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCategoryId, searchFilters.status, searchFilters.lowStock]);

  // * Detectar si hay cambios pendientes en la búsqueda (usuario escribiendo)
  const isSearchPending = searchFilters.search !== debouncedSearch || searchFilters.categoryId !== debouncedCategoryId || searchFilters.status !== debouncedStatus;

  // * Ref para rastrear si hay un fetch intencional (usuario busca/filtra)
  const isIntentionalFetchRef = useRef(false);

  // * ESTRATEGIA: Activar el flag cuando el usuario EMPIEZA a escribir o cambia filtros
  // Esto sucede ANTES del debounce, asegurando que el flag esté listo cuando el fetch inicie
  useEffect(() => {
    // Activar el flag si el usuario tiene algo escrito O cambió filtros de select
    const productIsSearching = searchFilters.search !== '' || searchFilters.categoryId !== '' || searchFilters.status !== '' || searchFilters.lowStock === true;
    if (productIsSearching) {
      isIntentionalFetchRef.current = true;
    }
  }, [searchFilters.search, searchFilters.categoryId, searchFilters.status, searchFilters.lowStock]);

  // * Resetear el flag cuando el fetch termina exitosamente
  useEffect(() => {
    if (!isFetching && isIntentionalFetchRef.current) {
      // Resetear después de que el fetch complete
      const timer = setTimeout(() => {
        isIntentionalFetchRef.current = false;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  // * Loader para búsquedas/filtros: Solo se muestra para fetches INTENCIONALES
  const isSearching = isIntentionalFetchRef.current && isFetching && !isSearchPending && !isMutating;


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Título con icono y toggle tema */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <Package className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold ${colors.text.primary}`}>
              Productos del Sistema
            </h3>
          </div>
        </div>
        {/* Botones de acción - Responsive */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
          {/* Botón para ver historial de movimientos */}
          <button
            onClick={handleNavigateToStockMovements}
            className={`flex items-center px-3 py-2 sm:px-3.5 sm:py-2 lg:px-4 lg:py-2.5 ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border ${isDark ? 'border-[#334155]' : 'border-gray-200'} rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer`}
          >
            <ClipboardList className={`w-4 h-4 lg:w-5 lg:h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            <span className={`${colors.text.primary} font-medium text-xs lg:text-sm ml-1.5 lg:ml-2 hidden md:inline`}>Ver Movimientos</span>
          </button>
          
          {/* Botón para agregar producto - más ancho */}
          <button
            onClick={handleOpenModal}
            className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-2.5 xl:px-10 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-lg hover:shadow-xl transition-all duration-200 shadow-md cursor-pointer min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]`}
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-[#2309095c]" />
            <span className="text-[#08080865] font-semibold lg:font-bold text-sm lg:text-base ml-1.5 lg:ml-2">Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <ProductStats productsStats={productsStats} />

      {/* Search and Filters */}
      <ProductSearchPage
        searchValue={searchFilters.search || ""}
        onSearchChange={(value: string) => handleSearchFiltersChange({ ...searchFilters, search: value })}
        categoryFilter={searchFilters.categoryId || ""}
        onCategoryChange={(value: string) => handleSearchFiltersChange({ ...searchFilters, categoryId: value })}
        statusFilter={searchFilters.status as ProductStatus | ""}
        onStatusChange={(value: ProductStatus | "") => handleSearchFiltersChange({ ...searchFilters, status: value })}
        lowStockFilter={searchFilters.lowStock || false}
        onLowStockChange={(value: boolean) => handleSearchFiltersChange({ ...searchFilters, lowStock: value })}
        nearExpirationFilter={searchFilters.nearExpiration || false}
        onNearExpirationChange={(value: boolean) => handleSearchFiltersChange({ ...searchFilters, nearExpiration: value })}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
      />

     <ProductToggleFromGridToList products={products} total={total} />

      {/* Products Grid */}
      <ProductGrid 
        products={products}
        isLoading={isLoading || isMutating || isSearching}
        currentParams={currentParams}
        onPageEmpty={handlePageEmpty}
      />

      {/* Pagination */}
      {total > 0 && (
        <ProductPagination
          paginationData={{ 
            total, 
            page: currentPage, 
            limit: currentLimit, 
            totalPages, 
            nextPage, 
            previousPage 
          }}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          currentLimit={limit}
          isLoading={isLoading}
        />
      )}

      {/* Create Product Modal */}
      {modalMode === 'create' && (
        <FormProductModal currentParams={currentParams} onNewPageCreated={handlePageChange} />
      )}
      {/* Update Product Modal */}
      {modalMode === 'update' && (
        <FormProductModal currentParams={currentParams} onNewPageCreated={handlePageChange} />
      )}
      
      {/* Stock Movement Modal */}
      {isStockModalOpen && (
        <FormStockMovementModal currentParams={currentParams} />
      )}
    </div>
  );
};
