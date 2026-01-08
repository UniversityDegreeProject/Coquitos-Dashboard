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

  const { isDark } = useTheme();
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
      {/* Header - Responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Título con icono y toggle tema */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`p-1.5 sm:p-2 rounded-lg ${
                isDark
                  ? "bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20"
                  : "bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20"
              }`}
            >
              <History
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isDark ? "text-[#F59E0B]" : "text-[#275081]"
                }`}
              />
            </div>
            <h3
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${colors.text.primary}`}
            >
              Registro de Actividades
            </h3>
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
