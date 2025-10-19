import { Plus, Grid, List } from "lucide-react";
import { useProductStore } from "../store/product.store";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";

interface ProductButtonsActionsProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

/**
 * Componente con botones de acciones para productos
 * - Agregar Producto
 * - Cambiar vista (Grid/List)
 */
export const ProductButtonsActions = ({ viewMode, onViewModeChange }: ProductButtonsActionsProps) => {
  const { colors, isDark } = useTheme();
  const setOpenModalCreate = useProductStore(useShallow((state) => state.setOpenModalCreate));

  const handleOpenModal = () => {
    setOpenModalCreate();
  };

  return (
    <div className="flex items-center gap-3">
      {/* Botones de vista */}
      <div className={`flex items-center rounded-lg overflow-hidden border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 transition-colors ${
            viewMode === 'grid'
              ? isDark 
                ? 'bg-[#334155] text-[#F59E0B]' 
                : 'bg-[#275081] text-white'
              : isDark
                ? 'bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
                : 'bg-white text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Vista en cuadrícula"
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 transition-colors ${
            viewMode === 'list'
              ? isDark 
                ? 'bg-[#334155] text-[#F59E0B]' 
                : 'bg-[#275081] text-white'
              : isDark
                ? 'bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
                : 'bg-white text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Vista en lista"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Botón Agregar Producto */}
      <button
        onClick={handleOpenModal}
        className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
      >
        <Plus className="w-5 h-5 mr-2" />
        <span className="font-bold">Agregar Producto</span>
      </button>
    </div>
  );
};

