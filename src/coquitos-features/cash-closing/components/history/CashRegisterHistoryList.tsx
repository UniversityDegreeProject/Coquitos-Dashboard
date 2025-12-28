import { memo, useState, useCallback, useMemo } from "react";
import { History } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/auth/store/auth.store";
import { useShallow } from "zustand/shallow";
import { useGetCashRegisterHistory } from "../../hooks";
import { CashRegisterHistoryItem } from "./CashRegisterHistoryItem";
import { CashRegisterHistoryEmptyState } from "./CashRegisterHistoryEmptyState";
import { CashRegisterHistoryPagination } from "./CashRegisterHistoryPagination";
import { GenericGridLoader } from "@/shared/components";
import { cn } from "@/lib/utils";
import type { GetCashRegisterHistoryParams } from "../../interfaces";
import { getIdByUserRole } from "../../helpers";

/**
 * Componente principal del historial de cierres de caja
 * Muestra lista paginada de todos los cierres realizados
 */
export const CashRegisterHistoryList = memo(() => {
  const { isDark } = useTheme();
  const user = useAuthStore(useShallow((state) => state.user));

  // Estado de paginación
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const userId = getIdByUserRole(user!);

  // Parámetros de búsqueda memoizados
  const searchParams: GetCashRegisterHistoryParams = useMemo(
    () => ({
      userId: userId, // TODO: Filtrar todo si es administrador en caso de ser usuario normal filtrar por usuario actual.
      page,
      limit,
    }),
    [userId, page, limit]
  );

  // Obtener historial
  const {
    cashRegisters,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    isFetching,
  } = useGetCashRegisterHistory(searchParams);

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-lg",
            isDark
              ? "bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20"
              : "bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20"
          )}
        >
          <History
            className={cn(
              "w-5 h-5",
              isDark ? "text-[#F59E0B]" : "text-[#275081]"
            )}
          />
        </div>
        <h3
          className={cn(
            "text-xl font-bold",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Historial de Cierres
        </h3>
      </div>

      {/* Loading */}
      {isLoading && (
        <GenericGridLoader title="Cargando historial de cierres..." />
      )}

      {/* Lista de cierres */}
      {!isLoading && cashRegisters.length === 0 && (
        <CashRegisterHistoryEmptyState />
      )}

      {!isLoading && cashRegisters.length > 0 && (
        <>
          <div className="space-y-4">
            {cashRegisters.map((cashRegister) => (
              <CashRegisterHistoryItem
                key={cashRegister.id}
                cashRegister={cashRegister}
              />
            ))}
          </div>

          {/* Paginación */}
          <CashRegisterHistoryPagination
            total={total}
            page={currentPage}
            limit={currentLimit}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            currentLimit={currentLimit}
            isLoading={isFetching}
          />
        </>
      )}
    </div>
  );
});
