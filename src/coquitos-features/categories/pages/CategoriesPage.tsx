//* Librerias
import { Plus, Layers } from "lucide-react";
import { useCallback, useState } from "react";

//* Others
import { CategorySearchPage, CategoryGrid } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import type { Category } from "../interfaces";

export const CategoriesPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // * Theme
  const { colors, isDark } = useTheme();

  // * Datos de ejemplo (en el futuro vendrán de un hook/servicio)
  const categories: Category[] = [
    { 
      id: "1", 
      name: 'Combos', 
      description: 'Combos familiares e individuales con los mejores precios', 
      status: 'Activo',
      productCount: 8,
      color: 'from-orange-400 to-red-500'
    },
    { 
      id: "2", 
      name: 'Pollo', 
      description: 'Pollo broaster y frito tradicional con recetas únicas', 
      status: 'Activo',
      productCount: 12,
      color: 'from-blue-400 to-purple-500'
    },
    { 
      id: "3", 
      name: 'Alitas', 
      description: 'Alitas en diferentes salsas picantes y dulces', 
      status: 'Activo',
      productCount: 6,
      color: 'from-green-400 to-teal-500'
    },
    { 
      id: "4", 
      name: 'Infantil', 
      description: 'Productos especiales para niños con porciones ideales', 
      status: 'Activo',
      productCount: 4,
      color: 'from-pink-400 to-rose-500'
    },
    { 
      id: "5", 
      name: 'Bebidas', 
      description: 'Refrescos, jugos naturales y bebidas calientes', 
      status: 'Activo',
      productCount: 15,
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      id: "6", 
      name: 'Acompañantes', 
      description: 'Papas, ensaladas frescas y extras deliciosos', 
      status: 'Activo',
      productCount: 10,
      color: 'from-indigo-400 to-blue-500'
    }
  ];

  // * Filtrar categorías basado en la búsqueda
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    category.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // * Memoizar el callback del botón
  const handleOpenModal = useCallback(() => {
    setShowCreateCategory(true);
  }, []);

  // * Handlers para acciones
  const handleEditCategory = useCallback((category: Category) => {
    console.log('Editar categoría:', category);
    // TODO: Implementar lógica de edición
  }, []);

  const handleDeleteCategory = useCallback((category: Category) => {
    console.log('Eliminar categoría:', category);
    // TODO: Implementar lógica de eliminación
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

      {/* Search and Filters */}
      <CategorySearchPage
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Categories Grid */}
      <CategoryGrid 
        categories={filteredCategories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Create Category Modal - TODO: Convertir a componente reutilizable */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl max-w-md w-full shadow-2xl`}>
            <div className={`p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${colors.text.primary}`}>Agregar Categoría</h2>
              <button
                onClick={() => setShowCreateCategory(false)}
                className={`${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="Ej: Combos"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Descripción
                </label>
                <textarea
                  rows={3}
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="Descripción de la categoría..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateCategory(false)}
                  className={`flex-1 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-[#334155] text-[#94A3B8] hover:bg-[#334155]' : 'border-[#E5E7EB] text-gray-700 hover:bg-gray-50'} transition-all duration-200`}
                >
                  Cancelar
                </button>
                <button className={`flex-1 px-4 py-2 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-lg transition-all duration-200`}>
                  Guardar Categoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};