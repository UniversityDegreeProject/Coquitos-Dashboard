import { memo, useCallback } from "react";
import { Eye, Printer } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Sale, SearchSalesParams } from "../interfaces";

interface SaleButtonsActionsProps {
  sale: Sale;
  currentParams: SearchSalesParams;
  onPageEmpty?: () => void;
}

/**
 * Botones de acción para cada venta
 * - Ver detalle
 * - Reimprimir recibo
 */
export const SaleButtonsActions = memo(({ sale }: SaleButtonsActionsProps) => {
  const { isDark } = useTheme();

  // * Handler para ver detalle de la venta
  const handleViewDetail = useCallback(() => {
    // TODO: Implementar navegación a detalle de venta
    console.log("Ver detalle de venta:", sale.id);
  }, [sale.id]);

  // * Handler para reimprimir recibo
  const handlePrint = useCallback(() => {
    // TODO: Implementar impresión de recibo
    console.log("Imprimir recibo de venta:", sale.saleNumber);
  }, [sale.saleNumber]);

  return (
    <div className="flex space-x-2 flex-shrink-0">
      <button
        onClick={handleViewDetail}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? "text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
            : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        }`}
        aria-label="Ver detalle"
        title="Ver detalle"
        type="button"
      >
        <Eye className="w-4 h-4" />
      </button>

      <button
        onClick={handlePrint}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? "text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            : "text-purple-600 hover:bg-purple-50 hover:text-purple-700"
        }`}
        aria-label="Reimprimir"
        title="Reimprimir recibo"
        type="button"
      >
        <Printer className="w-4 h-4" />
      </button>
    </div>
  );
});
