import { memo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { cn } from "@/lib/utils";

interface CashRegisterHistoryPaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  currentLimit: number;
  isLoading?: boolean;
}

/**
 * Componente de paginación para el historial de cierres
 */
export const CashRegisterHistoryPagination = memo(
  ({
    total,
    page,
    totalPages,
    onPageChange,
    onLimitChange,
    currentLimit,
    isLoading = false,
  }: CashRegisterHistoryPaginationProps) => {
    const { isDark } = useTheme();

    const handleFirstPage = () => {
      if (page > 1 && !isLoading) onPageChange(1);
    };

    const handlePreviousPage = () => {
      if (page > 1 && !isLoading) onPageChange(page - 1);
    };

    const handleNextPage = () => {
      if (page < totalPages && !isLoading) onPageChange(page + 1);
    };

    const handleLastPage = () => {
      if (page < totalPages && !isLoading) onPageChange(totalPages);
    };

    if (total === 0) return null;

    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg",
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-200",
          "border"
        )}
      >
        {/* Información */}
        <div
          className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}
        >
          Total de cierres: <span className="font-semibold">{total}</span> -
          página: <span className="font-semibold">{page}</span>
        </div>

        {/* Selector de límite */}
        <div className="flex items-center gap-2">
          <label
            className={cn(
              "text-sm",
              isDark ? "text-gray-400" : "text-gray-600"
            )}
          >
            Límite por página:
          </label>
          <select
            value={currentLimit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              onLimitChange(newLimit);
            }}
            disabled={isLoading}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-sm",
              isDark
                ? "bg-[#0F172A] border-[#334155] text-white"
                : "bg-white border-gray-300 text-gray-900",
              "focus:outline-none focus:ring-2",
              isDark ? "focus:ring-[#F59E0B]/50" : "focus:ring-[#275081]/50",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFirstPage}
            disabled={page === 1 || isLoading}
            className={cn(
              "p-2 rounded-lg transition-all",
              isDark
                ? "text-gray-400 hover:text-white hover:bg-[#334155]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Primera página"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handlePreviousPage}
            disabled={page === 1 || isLoading}
            className={cn(
              "p-2 rounded-lg transition-all",
              isDark
                ? "text-gray-400 hover:text-white hover:bg-[#334155]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span
            className={cn(
              "px-4 py-2 rounded-lg font-semibold",
              isDark ? "bg-[#0F172A] text-white" : "bg-gray-100 text-gray-900"
            )}
          >
            {page}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages || isLoading}
            className={cn(
              "p-2 rounded-lg transition-all",
              isDark
                ? "text-gray-400 hover:text-white hover:bg-[#334155]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleLastPage}
            disabled={page >= totalPages || isLoading}
            className={cn(
              "p-2 rounded-lg transition-all",
              isDark
                ? "text-gray-400 hover:text-white hover:bg-[#334155]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Última página"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
);
