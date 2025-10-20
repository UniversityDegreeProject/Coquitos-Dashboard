//* Librerias
import { Plus, Layers } from "lucide-react";
import { useCallback, useState } from "react";

//* Others
import { CategorySearchPage, CategoryGridTable, FormCategoryModal, CategoryStats } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import { useCategorySearch } from "../hooks/useSearchCategories";
import { useCategoryStore } from "../store/category.store";
import type { CategoryStatus } from "../interfaces";
import { useShallow } from "zustand/shallow";
import TextCursor from "@/components/TextCursor";

/**
 * Página principal de gestión de categorías
 * Implementa búsqueda, filtros, estadísticas y CRUD completo
 * Optimizado con memoización (useCallback, useMemo, memo) para máxima performance
 */
export const CategoriesPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | "">("");

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // *Zustand - Optimizado con selectores específicos
  const modalMode = useCategoryStore(useShallow((state) => state.modalMode));
  const setOpenModalCreate = useCategoryStore(useShallow((state) => state.setOpenModalCreate));
  
  // * Hook de búsqueda con todos los filtros
  const { categories, isLoading } = useCategorySearch({
    search: debouncedSearch,
    status: statusFilter,
  });
  
  // * Theme
  const { colors, isDark } = useTheme();
  
  // * Memoizar callbacks para evitar re-renders innecesarios
  const handleOpenModal = useCallback(() => {
    setOpenModalCreate();
  }, [setOpenModalCreate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStatusChange = useCallback((value: CategoryStatus | "") => {
    setStatusFilter(value);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Layers className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Categorías de Productos
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus className="w-5 h-5 mr-2 text-[#2309095c]" />
          <span className="text-[#08080865] font-bold">Agregar Categoría</span>
        </button>
      </div>

      {/* Statistics */}
      <CategoryStats categories={categories} />

      {/* Search and Filters */}
      <CategorySearchPage
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* Categories Grid/Table */}
      <CategoryGridTable categories={categories} isPending={isLoading} />

      {/* Create Category Modal */}
      {modalMode === 'create' && (
        <FormCategoryModal />
      )}
      {/* Update Category Modal */}
      {modalMode === 'update' && (
        <FormCategoryModal />
      )}

    <TextCursor text="⚛️" />

    </div>
  );
};
