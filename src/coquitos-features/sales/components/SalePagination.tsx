import { memo, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { GetSalesResponse } from "../interfaces";

interface SalePaginationProps {
  paginationData: Omit<GetSalesResponse, "data">;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  currentLimit: number;
  isLoading?: boolean;
}

/**
 * Componente de paginación para ventas
 * Diseño moderno y visual con gradientes y efectos interactivos
 * Incluye controles de navegación y selector de límite por página
 */
export const SalePagination = memo(
  ({
    paginationData,
    onPageChange,
    onLimitChange,
    currentLimit,
    isLoading = false,
  }: SalePaginationProps) => {
    const { isDark } = useTheme();

    const { total, totalPages, page } = paginationData;

    // Generar array de páginas a mostrar (máximo 5 páginas visibles)
    const visiblePages = useMemo(() => {
      const pages: (number | string)[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        // Si hay pocas páginas, mostrar todas
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Lógica para mostrar páginas con elipsis
        if (page <= 3) {
          // Al inicio
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (page >= totalPages - 2) {
          // Al final
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          // En el medio
          pages.push(1);
          pages.push("...");
          for (let i = page - 1; i <= page + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    }, [page, totalPages]);

    // Handlers
    const handleFirstPage = () => {
      if (page > 1) {
        onPageChange(1);
      }
    };

    const handlePreviousPage = () => {
      if (page > 1) {
        onPageChange(page - 1);
      }
    };

    const handleNextPage = () => {
      if (page < totalPages) {
        onPageChange(page + 1);
      }
    };

    const handleLastPage = () => {
      if (page < totalPages) {
        onPageChange(totalPages);
      }
    };

    const handlePageClick = (pageNumber: number) => {
      if (pageNumber !== page && pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
      }
    };

    // Opciones de límite por página
    const limitOptions = [5, 10, 20, 50, 100];

    // Si no hay datos, no mostrar paginación
    if (total === 0) {
      return null;
    }

    return (
      <div
        className={`${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E5E7EB]"
        } rounded-xl p-6 shadow-sm border backdrop-blur-sm transition-all duration-300`}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Información y selector en la parte superior */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Información de resultados */}
            <div
              className={`text-sm ${
                isDark ? "text-[#94A3B8]" : "text-[#6B7280]"
              }`}
            >
              Total de ventas:{" "}
              <span
                className={`font-semibold ${
                  isDark ? "text-[#F8FAFC]" : "text-[#1F2937]"
                }`}
              >
                {total} -
              </span>
              {""}{" "}
              <span
                className={` ${isDark ? "text-[#F8FAFC]" : "text-[#1F2937]"}`}
              >
                página: {page}
              </span>{" "}
            </div>

            {/* Separador vertical */}
            <div
              className={`hidden sm:block w-px h-5 ${
                isDark ? "bg-[#475569]/50" : "bg-gray-300/50"
              }`}
            />

            {/* Selector de límite por página */}
            <div className="flex items-center gap-2">
              <label
                className={`text-sm ${
                  isDark ? "text-[#94A3B8]" : "text-[#6B7280]"
                }`}
              >
                Límite de ventas por página:
              </label>
              <select
                value={currentLimit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-lg border ${
                  isDark
                    ? "bg-[#1E293B] border-[#334155] text-[#F8FAFC] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20"
                    : "bg-white border-[#E5E7EB] text-[#1F2937] focus:border-[#275081] focus:ring-[#275081]/20"
                } focus:ring-2 ring-offset-1 outline-none transition-all duration-200 text-sm ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {limitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Controles de paginación centrados */}
          <div className="flex items-center justify-center gap-1">
            {/* Primera página << */}
            <button
              onClick={handleFirstPage}
              disabled={page === 1 || isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                page === 1
                  ? `opacity-50 cursor-not-allowed ${
                      isDark ? "text-[#475569]" : "text-[#D1D5DB]"
                    }`
                  : `${
                      isDark
                        ? "text-[#94A3B8] hover:bg-[#334155] hover:text-[#F59E0B]"
                        : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#275081]"
                    }`
              }`}
              aria-label="Primera página"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>

            {/* Página anterior < */}
            <button
              onClick={handlePreviousPage}
              disabled={page === 1 || isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                page === 1
                  ? `opacity-50 cursor-not-allowed ${
                      isDark ? "text-[#475569]" : "text-[#D1D5DB]"
                    }`
                  : `${
                      isDark
                        ? "text-[#94A3B8] hover:bg-[#334155] hover:text-[#F59E0B]"
                        : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#275081]"
                    }`
              }`}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Números de página en el medio */}
            <div className="flex items-center gap-1 mx-2">
              {visiblePages.map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className={`px-2 ${
                        isDark ? "text-[#94A3B8]" : "text-[#6B7280]"
                      }`}
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber = pageNum as number;
                const isActive = pageNumber === page;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    disabled={isLoading}
                    className={`min-w-[40px] px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? `${
                            isDark
                              ? "bg-gradient-to-r from-[#1E3A8A]/30 to-[#F59E0B]/30 text-[#F59E0B] border border-[#F59E0B]/50"
                              : "bg-gradient-to-r from-[#275081]/20 to-[#F9E44E]/20 text-[#275081] border border-[#275081]/50"
                          } shadow-sm ${isLoading ? "opacity-75" : ""}`
                        : `${
                            isDark
                              ? "text-[#94A3B8] hover:bg-[#334155] hover:text-[#F8FAFC]"
                              : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`
                    }`}
                    aria-label={`Ir a página ${pageNumber}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Página siguiente > */}
            <button
              onClick={handleNextPage}
              disabled={page === totalPages || isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                page === totalPages
                  ? `opacity-50 cursor-not-allowed ${
                      isDark ? "text-[#475569]" : "text-[#D1D5DB]"
                    }`
                  : `${
                      isDark
                        ? "text-[#94A3B8] hover:bg-[#334155] hover:text-[#F59E0B]"
                        : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#275081]"
                    }`
              }`}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Última página >> */}
            <button
              onClick={handleLastPage}
              disabled={page === totalPages || isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                page === totalPages
                  ? `opacity-50 cursor-not-allowed ${
                      isDark ? "text-[#475569]" : "text-[#D1D5DB]"
                    }`
                  : `${
                      isDark
                        ? "text-[#94A3B8] hover:bg-[#334155] hover:text-[#F59E0B]"
                        : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#275081]"
                    }`
              }`}
              aria-label="Última página"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SalePagination.displayName = "SalePagination";
