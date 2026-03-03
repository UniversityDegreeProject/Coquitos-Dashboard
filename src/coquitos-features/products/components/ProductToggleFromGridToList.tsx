import { LayoutGrid, List } from "lucide-react";
import { useProductStore } from "../store/product.store";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Product } from "../interfaces";

interface ProductToggleFromGridToListProps {
  products: Product[];
  total: number;
}

export const ProductToggleFromGridToList = ({ products, total, }: ProductToggleFromGridToListProps) => {

  const viewMode = useProductStore(useShallow((state) => state.viewMode));
  const setViewMode = useProductStore(useShallow((state) => state.setViewMode));
  const isDark = useTheme().isDark;

  return (
    <>
      {/* Botones de cambio de vista - Separados del buscador */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              viewMode === "grid"
                ? isDark
                  ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]"
                  : "bg-[#275081]/10 border-[#275081] text-[#275081]"
                : isDark
                ? "bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:border-[#64748B]"
                : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#E5E7EB]"
            }`}
            title="Vista en cuadrícula"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="font-medium text-sm">Cuadrícula</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              viewMode === "list"
                ? isDark
                  ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]"
                  : "bg-[#275081]/10 border-[#275081] text-[#275081]"
                : isDark
                ? "bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:border-[#64748B]"
                : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#E5E7EB]"
            }`}
            title="Vista en lista"
          >
            <List className="w-5 h-5" />
            <span className="font-medium text-sm">Lista</span>
          </button>
        </div>

        {/* Indicador de resultados */}
        <div
          className={`text-sm ${isDark ? "text-[#94A3B8]" : "text-gray-600"}`}
        >
          Mostrando <span className="font-semibold">{products.length}</span> de{" "}
          <span className="font-semibold">{total}</span> productos
        </div>
      </div>
    </>
  );
};
