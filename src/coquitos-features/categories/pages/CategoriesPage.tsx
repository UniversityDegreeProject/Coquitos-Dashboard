//* Librerias
import { Layers, Plus } from "lucide-react";
import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { useShallow } from "zustand/shallow";

//* Others
import {
  CategoryGrid,
  FormCategoryModal,
  CategoryStats,
  CategoryPaginations,
} from "../components";
import { useCategoryStore } from "../store/category.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "../hooks/useDebounce";
import type { SearchCategoriesParams } from "../interfaces";
import { useGetCategories } from "../hooks/useGetCategories";
import { useCategoriesStats } from "../hooks/useCategoriesStats";
import {
  categoriesSearchSchema,
  type SearchCategoriesSchema,
} from "../schemas";
import { GenericSearchBar } from "@/shared/components";
import { categoriesSearchFilterOptions } from "../const";

const searchDefaultValues: SearchCategoriesSchema = {
  search: "",
  status: "",
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
  const [searchFilters, setSearchFilters] =
    useState<SearchCategoriesSchema>(searchDefaultValues);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchFilters.search, 500);
  const debouncedStatus = useDebounce(searchFilters.status, 500);

  // * Zustand Category
  const modalMode = useCategoryStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useCategoryStore(
    useShallow((state) => state.setOpenModalCreate),
  );
  const isMutation = useCategoryStore(useShallow((state) => state.isMutation));

  // * Theme
  const { colors, isDark } = useTheme();

  // * Tanstack Query - Hook de búsqueda con todos los filtros
  const currentParams: SearchCategoriesParams = {
    search: debouncedSearch,
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
    isFetching,
  } = useGetCategories(currentParams);

  // * Hook para estadísticas globales (todas las categorías, no solo la página actual)
  const { stats } = useCategoriesStats({
    search: debouncedSearch,
    status: searchFilters.status,
  });

  // * Handler cuando cambian los filtros del buscador
  const handleSearchFiltersChange = useCallback(
    (values: SearchCategoriesSchema) => {
      setSearchFilters(values);
    },
    [],
  );

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
  }, [debouncedSearch, searchFilters.status]);

  // * Render cada vez que el usuario esta escribiendo en el search
  const isSearchPending =
    searchFilters.search !== debouncedSearch ||
    searchFilters.status !== debouncedStatus;
  // *
  const isIntentionalFetchByUser = useRef<boolean>(false);

  // * Detectar si los filtros han cambiado por el usuario
  useEffect(() => {
    const filtersHasBeenChange =
      searchFilters.search !== "" || searchFilters.status !== "";
    if (filtersHasBeenChange) {
      isIntentionalFetchByUser.current = true;
    }
  }, [searchFilters.search, searchFilters.status]);

  // * Resetear el flag cuando el fetch ha terminado
  useEffect(() => {
    if (!isFetching && isIntentionalFetchByUser.current) {
      const time = setTimeout(() => {
        isIntentionalFetchByUser.current = false;
      }, 1000);
      return () => clearTimeout(time);
    }
  }, [isFetching, isSearchPending]);

  // * El usuario esta buscando (ha escrito o filtrado) y hay un fetch en curso que NO es el debounce
  const isSearching = useMemo(() => {
    return (
      isIntentionalFetchByUser.current &&
      isFetching &&
      !isSearchPending &&
      !isMutation
    );
  }, [isFetching, isSearchPending, isMutation]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Título con icono y toggle tema */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`p-1.5 sm:p-2 rounded-lg ${isDark ? "bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20" : "bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20"}`}
            >
              <Layers
                className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? "text-[#F59E0B]" : "text-[#275081]"}`}
              />
            </div>
            <h3
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${colors.text.primary}`}
            >
              Categorías del Sistema
            </h3>
          </div>
        </div>

        {/* Botones - Responsive */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
          {/* Botón agregar */}
          <button
            onClick={handleOpenModal}
            className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-2.5 xl:px-10 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-lg hover:shadow-md transition-all duration-200 shadow-md cursor-pointer min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]`}
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-[#2309095c]" />
            <span className="text-[#08080865] font-semibold lg:font-bold text-sm lg:text-base ml-1.5 lg:ml-2">
              Agregar Categoría
            </span>
          </button>
        </div>
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
      <CategoryGrid
        categories={categories}
        isPending={isLoading || isMutation || isSearching}
        currentParams={currentParams}
        onPageEmpty={handlePageEmpty}
      />

      {/* Pagination */}
      {total > 0 && (
        <CategoryPaginations
          paginationData={{
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages,
            nextPage,
            previousPage,
          }}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          currentLimit={limit}
          isLoading={isLoading}
        />
      )}

      {/* Modals */}
      {modalMode === "create" && (
        <FormCategoryModal currentParams={currentParams} existingNames={categories.map(c => c.name)} />
      )}
      {modalMode === "update" && (
        <FormCategoryModal currentParams={currentParams} existingNames={categories.map(c => c.name)} />
      )}
    </div>
  );
};
