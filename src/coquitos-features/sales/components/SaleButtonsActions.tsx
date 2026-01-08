import { memo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router";
import { Eye, Printer } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { paths } from "@/router/paths";
import type { Sale, SearchSalesParams } from "../interfaces";
import { SaleReceipt } from "./SaleReceipt";

interface SaleButtonsActionsProps {
  sale: Sale;
  currentParams: SearchSalesParams;
  onPageEmpty?: () => void;
}

/**
 * Botones de acción para cada venta
 * - Ver detalle
 * - Reimprimir recibo (imprime directamente sin redirigir)
 */
export const SaleButtonsActions = memo(({ sale }: SaleButtonsActionsProps) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // * Handler para ver detalle de la venta
  const handleViewDetail = useCallback(() => {
    if (sale.id) {
      navigate(paths.dashboard.saleDetail(sale.id));
    }
  }, [sale.id, navigate]);

  // * Handler para reimprimir recibo - imprime directamente sin redirigir
  const handlePrint = useCallback(() => {
    // Crear un contenedor temporal en el body para el recibo
    const printContainer = document.createElement("div");
    printContainer.id = "sale-receipt-print-container";
    printContainer.style.position = "fixed";
    printContainer.style.top = "-9999px";
    printContainer.style.left = "-9999px";
    document.body.appendChild(printContainer);

    // Renderizar el recibo
    const root = createRoot(printContainer);
    root.render(<SaleReceipt sale={sale} />);

    // Esperar un momento para que se renderice y luego imprimir
    setTimeout(() => {
      window.print();

      // Limpiar después de imprimir
      setTimeout(() => {
        root.unmount();
        document.body.removeChild(printContainer);
      }, 500);
    }, 200);
  }, [sale]);

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
