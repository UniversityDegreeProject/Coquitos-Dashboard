// * Libraries
import { Plus, ShoppingCart } from "lucide-react";
import { useCallback, useState, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import { useSaleStore } from "../store/sale.store";
import { useAuthStore } from "@/auth/store/auth.store";
// * Components
import {
  FormCreateSaleModal,
  SaleStats,
  SaleGrid,
  SalePagination,
} from "../components";
import { GenericSearchBar } from "@/shared/components";
// * Hooks
import { useSalesStats, useGetSales } from "../hooks";
// * Schemas
import { searchSalesSchema, type SearchSalesSchema } from "../schemas";
// * Const
import { salesSearchFiltersOptions } from "../const";
// * Interfaces
import type { SearchSalesParams } from "../interfaces";

// * Helpers
import { calculateDateRange } from "@/shared/helpers";

const searchDefaultValues: SearchSalesSchema = {
  search: "",
  paymentMethod: "",
  status: "",
  dateRange: "today",
  startDate: "",
  endDate: "",
};

/**
 * Página principal de gestión de ventas
 * Permite registrar ventas y ver historial con filtros y estadísticas
 */
export const SalesPage = () => {
  // * Paginación
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  // * Estado para los filtros
  const [searchFilters, setSearchFilters] =
    useState<SearchSalesSchema>(searchDefaultValues);

  // * Auth - Usuario autenticado
  const user = useAuthStore(useShallow((state) => state.user));

  // * Zustand
  const isCreateSaleModalOpen = useSaleStore(
    useShallow((state) => state.isCreateSaleModalOpen),
  );
  const openCreateSaleModal = useSaleStore(
    useShallow((state) => state.openCreateSaleModal),
  );

  // * Theme
  const { colors, isDark } = useTheme();

  // * Traer datos segun la fecha seleccionada (today, week, month)
  const dateParams = useMemo(() => {
    return calculateDateRange({ dateRange: searchFilters.dateRange });
  }, [searchFilters.dateRange]);

  // * TanStack Query - Parámetros de búsqueda memoizados
  const currentParams: SearchSalesParams = useMemo(() => {
    const params: SearchSalesParams = {
      paymentMethod: searchFilters.paymentMethod,
      status: searchFilters.status,
      page,
      limit,
    };

    // Si el usuario es Vendedor, filtrar solo por sus propias ventas
    if (user?.role === "Vendedor" && user?.id) {
      params.userId = user.id;
    }

    if (searchFilters.search) {
      params.search = searchFilters.search;
    }

    //? Solo agregar fechas si están definidas
    if (dateParams.startDate) {
      params.startDate = dateParams.startDate;
    }
    if (dateParams.endDate) {
      params.endDate = dateParams.endDate;
    }

    return params;
  }, [
    searchFilters.paymentMethod,
    searchFilters.status,
    searchFilters.search,
    dateParams,
    page,
    limit,
    user?.role,
    user?.id,
  ]);

  // * Hook para obtener ventas con paginación
  const {
    sales,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    nextPage,
    previousPage,
    isLoading,
    isFetching,
  } = useGetSales(currentParams);

  // * Hook para estadísticas globales
  const { stats } = useSalesStats(
    {
      paymentMethod: searchFilters.paymentMethod,
      status: searchFilters.status,
    },
    {
      // Si dateRange es 'today', filtrar por hoy; si está vacío, no filtrar (mostrar todas)
      filterByToday: searchFilters.dateRange === "today",
      // Si hay fechas definidas en dateParams, usarlas
      startDate: dateParams.startDate,
      endDate: dateParams.endDate,
      // Si el usuario es Vendedor, filtrar solo sus estadísticas
      userId: user?.role === "Vendedor" ? user?.id : undefined,
    },
  );

  // * Handlers
  const handleOpenModal = useCallback(() => {
    openCreateSaleModal();
  }, [openCreateSaleModal]);

  const handleSearchFiltersChange = useCallback((values: SearchSalesSchema) => {
    setSearchFilters(values);
    setPage(1); // Resetear a página 1 cuando cambian los filtros
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePageEmpty = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`p-1.5 sm:p-2 rounded-lg ${
                isDark
                  ? "bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20"
                  : "bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20"
              }`}
            >
              <ShoppingCart
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isDark ? "text-[#F59E0B]" : "text-[#275081]"
                }`}
              />
            </div>
            <h3
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${colors.text.primary}`}
            >
              Gestión de Ventas
            </h3>
          </div>
        </div>

        {/* Botón de registrar venta */}
        <button
          onClick={handleOpenModal}
          className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-2.5 xl:px-10 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-lg hover:shadow-md transition-all duration-200 shadow-md cursor-pointer min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]`}
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-[#2309095c]" />
          <span className="text-[#08080865] font-semibold lg:font-bold text-sm lg:text-base ml-1.5 lg:ml-2">
            Registrar Venta
          </span>
        </button>
      </div>

      {/* Statistics */}
      <SaleStats {...stats} />

      {/* Search and Filters */}
      <div className="space-y-4">
        <GenericSearchBar
          schema={searchSalesSchema}
          defaultValues={searchDefaultValues}
          onSearchChange={handleSearchFiltersChange}
          selectFilters={salesSearchFiltersOptions}
          searchPlaceholder="Buscar por número de venta, cliente..."
          searchLabel="Buscar Ventas"
        />
      </div>

      {/* Grid de ventas */}
      <SaleGrid
        sales={sales}
        isPending={isLoading}
        currentParams={currentParams}
        onPageEmpty={handlePageEmpty}
      />

      {/* Paginación */}
      {!isLoading && sales.length > 0 && (
        <SalePagination
          paginationData={{
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages,
            nextPage: nextPage ?? null,
            previousPage: previousPage ?? null,
          }}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          currentLimit={currentLimit}
          isLoading={isFetching}
        />
      )}

      {/* Modal de crear venta */}
      {isCreateSaleModalOpen && <FormCreateSaleModal />}
    </div>
  );
};
