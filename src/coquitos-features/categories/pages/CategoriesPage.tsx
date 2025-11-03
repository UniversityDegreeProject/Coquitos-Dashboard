//* Librerias
import { Layers, Plus } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";

//* Others
import { CategoryGrid, FormCategoryModal, CategoryStats, CategoryPaginations } from "../components";
import { useCategoryStore } from "../store/category.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "../hooks/useDebounce";
import type { SearchCategoriesParams } from "../interfaces";
import { useGetCategories } from "../hooks/useGetCategories";
import { useCategoriesStats } from "../hooks/useCategoriesStats";
import { categoriesSearchSchema, type SearchCategoriesSchema } from "../schemas";
import { GenericSearchBar } from "@/shared/components";
import { categoriesSearchFilterOptions } from "../const";

const searchDefaultValues: SearchCategoriesSchema = {
  search: '',
  categoryId: '',
  status: '',
  minStock: 0,
};
/**
 * Página principal de gestión de categorías
 * Implementa búsqueda, filtros, estadísticas y CRUD completo
 * Optimizado usando React Hook Form - Sin estados locales innecesarios
 */
export const CategoriesPage = () => {
  // * Paginacion ( necesarios)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  
  // * Estado para los filtros (controlado por el formulario)
  const [ searchFilters, setSearchFilters] = useState<SearchCategoriesSchema>(searchDefaultValues);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchFilters.search, 500);



  // * Zustand Category
  const modalMode = useCategoryStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useCategoryStore(useShallow((state) => state.setOpenModalCreate));
  const isMutation = useCategoryStore(useShallow((state) => state.isMutation));

  // * Theme
  const { colors, isDark } = useTheme();

  // * Tanstack Query - Hook de búsqueda con todos los filtros
  const currentParams: SearchCategoriesParams = {
    search: debouncedSearch,
    categoryId: searchFilters.categoryId,
    minStock: searchFilters.minStock,
    status: searchFilters.status,
    page,
    limit,
  };

  const { 
    categories, 
    total, 
    page: currentPage, 
    limit: currentLimit, 
    totalPages, 
    nextPage, 
    previousPage, 
    isLoading, 
    // isFetching NO se usa - el refetch automático debe ser silencioso
  } = useGetCategories(currentParams);

  // * Hook para estadísticas globales (todas las categorías, no solo la página actual)
  const { stats } = useCategoriesStats({
    search: debouncedSearch,
    minStock: searchFilters.minStock,
    status: searchFilters.status,
  });

  // * Handler cuando cambian los filtros del buscador
  const handleSearchFiltersChange = useCallback((values: SearchCategoriesSchema) => {
    setSearchFilters(values);
  }, []);

  // * Callback cuando una página queda vacía después de eliminar
  const handlePageEmpty = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // * Memoizar callbacks
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  // * Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, searchFilters.categoryId, searchFilters.status, searchFilters.minStock]);
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Layers className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Categorías del Sistema
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus className="w-5 h-5 mr-2 text-[#2309095c]" />
          <span className="text-[#08080865] font-bold">Agregar Categoría</span>
        </button>
      </div>

      {/* Statistics */}
      <CategoryStats {...stats} />

      {/* Search and Filters - Maneja su propio estado con React Hook Form */}
      <GenericSearchBar
        schema={categoriesSearchSchema}
        defaultValues={searchDefaultValues}
        onSearchChange={handleSearchFiltersChange}
        selectFilters={categoriesSearchFilterOptions}
        searchPlaceholder="Buscar por nombre, categoría o stock..."
        searchLabel="Buscar Categorías"
      />

      {/* Category Grid */}
      {/* Solo mostrar loader en: carga inicial (isLoading) o mutaciones CRUD (isMutating) */}
      {/* El refetch automático cada 3s NO debe mostrar loader */}
      <CategoryGrid categories={categories} isPending={isLoading || isMutation} currentParams={currentParams} onPageEmpty={handlePageEmpty} />

      {/* Pagination */}
      {total > 0 && (
        <CategoryPaginations
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

      {/* Modals */}
      {modalMode === 'create' && <FormCategoryModal currentParams={currentParams} onNewPageCreated={handlePageChange} />}
      {modalMode === 'update' && <FormCategoryModal currentParams={currentParams} onNewPageCreated={handlePageChange} />}
    </div>
  );
};