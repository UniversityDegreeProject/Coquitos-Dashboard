import { Plus, ShoppingCart, Calendar } from 'lucide-react';
import { useCallback, useState, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useTheme } from "@/shared/hooks/useTheme";
import { useOrderStore } from "../store/order.store";
import { 
  FormCreateOrderModal, 
  OrderStats, 
  OrderGrid, 
  OrderPagination 
} from "../components";
import { useOrdersStats, useGetOrders } from "../hooks";
import { GenericSearchBar } from "@/shared/components";
import { searchOrdersSchema, type SearchOrdersSchema } from "../schemas";
import { ordersSearchFiltersOptions } from "../const";
import type { SearchOrdersParams } from "../interfaces";

const searchDefaultValues: SearchOrdersSchema = {
  search: '',
  paymentMethod: '',
  status: '',
  dateRange: 'today', // Por defecto mostrar "Hoy"
  startDate: '',
  endDate: '',
};

/**
 * Página principal de gestión de órdenes (ventas)
 * Permite registrar ventas y ver historial con filtros y estadísticas
 */
export const OrdersPage = () => {
  // * Paginación
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  
  // * Estado para los filtros
  const [searchFilters, setSearchFilters] = useState<SearchOrdersSchema>(searchDefaultValues);

  // * Zustand
  const isCreateOrderModalOpen = useOrderStore(useShallow((state) => state.isCreateOrderModalOpen));
  const openCreateOrderModal = useOrderStore(useShallow((state) => state.openCreateOrderModal));
  
  // * Theme
  const { colors, isDark } = useTheme();

  // Helper para formatear fecha local a YYYY-MM-DD (evita problemas de zona horaria)
  const formatLocalDate = useCallback((date: Date): Date => {
    // Crear una nueva fecha usando los componentes locales para evitar problemas de zona horaria
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day);
  }, []);

  // Calcular fechas según el rango seleccionado
  const dateParams = useMemo(() => {
    // Si no hay filtro de fecha o está vacío, retornar undefined para no filtrar
    const dateRange = searchFilters.dateRange;
    if (!dateRange || (dateRange !== 'today' && dateRange !== 'week' && dateRange !== 'month' && dateRange !== 'custom')) {
      return { startDate: undefined, endDate: undefined };
    }

    const today = formatLocalDate(new Date());
    today.setHours(0, 0, 0, 0);

    switch (dateRange) {
      case 'today': {
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);
        return {
          startDate: today,
          endDate: endOfToday,
        };
      }
      case 'week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return {
          startDate: startOfWeek,
          endDate: endOfWeek,
        };
      }
      case 'month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        return {
          startDate: startOfMonth,
          endDate: endOfMonth,
        };
      }
      case 'custom': {
        if (searchFilters.startDate && searchFilters.endDate) {
          const start = formatLocalDate(new Date(searchFilters.startDate));
          start.setHours(0, 0, 0, 0);
          const end = formatLocalDate(new Date(searchFilters.endDate));
          end.setHours(23, 59, 59, 999);
          return {
            startDate: start,
            endDate: end,
          };
        }
        return { startDate: undefined, endDate: undefined };
      }
      default:
        return { startDate: undefined, endDate: undefined };
    }
  }, [searchFilters.dateRange, searchFilters.startDate, searchFilters.endDate, formatLocalDate]);

  // * TanStack Query - Parámetros de búsqueda memoizados
  const currentParams: SearchOrdersParams = useMemo(() => {
    const params: SearchOrdersParams = {
      paymentMethod: searchFilters.paymentMethod,
      status: searchFilters.status,
      page,
      limit,
    };
    
    // Solo agregar fechas si están definidas
    if (dateParams.startDate) {
      params.startDate = dateParams.startDate;
    }
    if (dateParams.endDate) {
      params.endDate = dateParams.endDate;
    }
    
    return params;
  }, [searchFilters.paymentMethod, searchFilters.status, dateParams, page, limit]);

  // * Hook para obtener órdenes con paginación
  const {
    orders,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    nextPage,
    previousPage,
    isLoading,
    isFetching,
  } = useGetOrders(currentParams);

  // * Hook para estadísticas globales
  const { stats } = useOrdersStats(
    {
      paymentMethod: searchFilters.paymentMethod,
      status: searchFilters.status,
    },
    {
      // Si dateRange es 'today', filtrar por hoy; si está vacío, no filtrar (mostrar todas)
      filterByToday: searchFilters.dateRange === 'today',
      // Si hay fechas definidas en dateParams, usarlas
      startDate: dateParams.startDate,
      endDate: dateParams.endDate,
    }
  );

  // * Handlers
  const handleOpenModal = useCallback(() => {
    openCreateOrderModal();
  }, [openCreateOrderModal]);

  const handleSearchFiltersChange = useCallback((values: SearchOrdersSchema) => {
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
            <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <ShoppingCart className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold ${colors.text.primary}`}>
              Gestión de Ventas
            </h3>
          </div>
        </div>
        
        {/* Botón de registrar venta */}
        <button
          onClick={handleOpenModal}
          className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-2.5 xl:px-10 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-lg hover:shadow-xl transition-all duration-200 shadow-md cursor-pointer min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]`}
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-[#2309095c]" />
          <span className="text-[#08080865] font-semibold lg:font-bold text-sm lg:text-base ml-1.5 lg:ml-2">Registrar Venta</span>
        </button>
      </div>

      {/* Statistics */}
      <OrderStats {...stats} />

      {/* Search and Filters */}
      <div className="space-y-4">
        <GenericSearchBar
          schema={searchOrdersSchema}
          defaultValues={searchDefaultValues}
          onSearchChange={handleSearchFiltersChange}
          selectFilters={ordersSearchFiltersOptions}
          searchPlaceholder="Buscar por número de orden, cliente..."
          searchLabel="Buscar Ventas"
        />
        
        {/* Filtro de Fechas */}
        <div className={`flex flex-wrap items-center gap-3 p-4 rounded-lg ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        } shadow-sm`}>
          <div className="flex items-center gap-2">
            <Calendar className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <select
              value={searchFilters.dateRange || ''}
              onChange={(e) => {
                const newRange = e.target.value as 'today' | 'week' | 'month' | 'custom' | '';
                handleSearchFiltersChange({
                  ...searchFilters,
                  dateRange: newRange,
                  startDate: newRange === 'custom' ? searchFilters.startDate : '',
                  endDate: newRange === 'custom' ? searchFilters.endDate : '',
                });
              }}
              className={`px-3 py-2 rounded-lg border ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:ring-2 focus:ring-[#275081] focus:border-transparent`}
            >
              <option value="">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="custom">Rango Personalizado</option>
            </select>
          </div>

          {searchFilters.dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={searchFilters.startDate || ''}
                onChange={(e) => {
                  handleSearchFiltersChange({
                    ...searchFilters,
                    startDate: e.target.value,
                  });
                }}
                className={`px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:ring-2 focus:ring-[#275081] focus:border-transparent`}
              />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>hasta</span>
              <input
                type="date"
                value={searchFilters.endDate || ''}
                onChange={(e) => {
                  handleSearchFiltersChange({
                    ...searchFilters,
                    endDate: e.target.value,
                  });
                }}
                className={`px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:ring-2 focus:ring-[#275081] focus:border-transparent`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid de órdenes */}
      <OrderGrid
        orders={orders}
        isPending={isLoading}
        currentParams={currentParams}
        onPageEmpty={handlePageEmpty}
      />

      {/* Paginación */}
      {!isLoading && orders.length > 0 && (
        <OrderPagination
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
      {isCreateOrderModalOpen && <FormCreateOrderModal />}
    </div>
  );
};
