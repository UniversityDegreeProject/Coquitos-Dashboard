import { useState, useMemo, useCallback } from "react";
import { History } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ActivityLogTable } from "../components/ActivityLogTable";
import { useActivityLogs } from "../hooks/useActivityLogs";
import { GenericSearchBar } from "@/shared/components";
import {
  searchActivityLogSchema,
  type SearchActivityLogSchema,
} from "../schemas/search-activity-log.schema";
import {
  activityLogSearchFiltersOptions,
  activityLogDateFilters,
} from "../const/search-options";
import { calculateDateRange } from "@/shared/helpers";

const searchDefaultValues: SearchActivityLogSchema = {
  search: "",
  action: "",
  entity: "",
  dateRange: "today",
  startDate: "",
  endDate: "",
};

export const ActivityLogPage = () => {
  const { colors } = useTheme();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters state
  const [searchFilters, setSearchFilters] =
    useState<SearchActivityLogSchema>(searchDefaultValues);

  // Calculate date range
  const dateParams = useMemo(() => {
    // If manual dates are set, ignore dateRange preset
    if (searchFilters.startDate || searchFilters.endDate) {
      return {
        startDate: searchFilters.startDate,
        endDate: searchFilters.endDate,
      };
    }
    return calculateDateRange({ dateRange: searchFilters.dateRange });
  }, [searchFilters.dateRange, searchFilters.startDate, searchFilters.endDate]);

  // Construct query params
  const queryParams = useMemo(() => {
    const formatParamDate = (
      date: string | Date | undefined
    ): string | undefined => {
      if (!date) return undefined;
      if (date instanceof Date) return date.toISOString();
      return date;
    };

    return {
      page,
      limit,
      search: searchFilters.search,
      action: searchFilters.action || undefined,
      entity: searchFilters.entity || undefined,
      startDate: formatParamDate(dateParams.startDate),
      endDate: formatParamDate(dateParams.endDate),
    };
  }, [
    page,
    limit,
    searchFilters.search,
    searchFilters.action,
    searchFilters.entity,
    dateParams,
  ]);

  // Fetch activity logs
  const { data, isLoading } = useActivityLogs(queryParams);

  // Handlers
  const handleSearchFiltersChange = useCallback(
    (values: SearchActivityLogSchema) => {
      setSearchFilters(values);
      setPage(1);
    },
    []
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#275081] to-[#F59E0B]">
            <History className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${colors.text.primary}`}>
              Registro de Actividades
            </h1>
            <p className={`${colors.text.muted}`}>
              Historial completo de acciones en el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <GenericSearchBar
        schema={searchActivityLogSchema}
        defaultValues={searchDefaultValues}
        onSearchChange={handleSearchFiltersChange}
        selectFilters={activityLogSearchFiltersOptions}
        dateFilters={activityLogDateFilters}
        searchPlaceholder="Buscar en descripciones..."
        searchLabel="Buscar Actividad"
      />

      {/* Table */}
      <ActivityLogTable
        logs={data?.activityLogs || []}
        isLoading={isLoading}
        pagination={
          data?.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          }
        }
        onPageChange={handlePageChange}
      />
    </div>
  );
};
