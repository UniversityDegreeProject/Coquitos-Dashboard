import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { ActivityLogCard } from "./ActivityLogCard";
import { ActivityLogDetailModal } from "./ActivityLogDetailModal";
import type { ActivityLog } from "../interfaces/activity-log";

interface ActivityLogTableProps {
  logs: ActivityLog[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const ActivityLogTable = ({
  logs,
  isLoading,
  pagination,
  onPageChange,
}: ActivityLogTableProps) => {
  const { isDark, colors } = useTheme();
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2
            className={`w-12 h-12 animate-spin mx-auto mb-4 ${colors.text.muted}`}
          />
          <p className={`text-lg ${colors.text.muted}`}>
            Cargando actividades...
          </p>
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div
        className={`${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-200"
        } rounded-xl p-12 text-center border`}
      >
        <p className={`text-xl ${colors.text.muted}`}>
          No se encontraron actividades con los filtros seleccionados
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {logs.map((log) => (
          <ActivityLogCard
            key={log.id}
            log={log}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          className={`flex items-center justify-between mt-6 p-4 ${
            isDark
              ? "bg-[#1E293B] border-[#334155]"
              : "bg-white border-gray-200"
          } rounded-xl border`}
        >
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              pagination.page === 1
                ? "opacity-50 cursor-not-allowed"
                : isDark
                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className={`flex items-center gap-2 ${colors.text.primary}`}>
            <span>Página</span>
            <span className="font-bold">
              {pagination.page} de {pagination.totalPages}
            </span>
            <span className={colors.text.muted}>
              ({pagination.total} registros en total)
            </span>
          </div>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              pagination.page >= pagination.totalPages
                ? "opacity-50 cursor-not-allowed"
                : isDark
                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <ActivityLogDetailModal
        log={selectedLog}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
