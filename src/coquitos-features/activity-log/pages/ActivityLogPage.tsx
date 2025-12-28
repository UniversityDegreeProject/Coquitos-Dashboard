import { useState, useEffect } from "react";
import { History } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useTheme } from "@/shared/hooks/useTheme";
import { ActivityLogFilters } from "../components/ActivityLogFilters";
import { ActivityLogTable } from "../components/ActivityLogTable";
import { useActivityLogs } from "../hooks/useActivityLogs";

export const ActivityLogPage = () => {
  const { colors } = useTheme();

  // Filter states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // Fetch activity logs
  const { data, isLoading } = useActivityLogs({
    page,
    limit: 10,
    search: debouncedSearch,
    action: action || undefined,
    entity: entity || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, action, entity, startDate, endDate]);

  const handleClearFilters = () => {
    setSearch("");
    setAction("");
    setEntity("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <ActivityLogFilters
        search={search}
        setSearch={setSearch}
        action={action}
        setAction={setAction}
        entity={entity}
        setEntity={setEntity}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClearFilters={handleClearFilters}
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
