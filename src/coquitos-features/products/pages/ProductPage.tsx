//* Librerias
import { Plus, Package, TrendingUp } from "lucide-react";
import { useCallback, useState } from "react";

//* Others
import { ProductSearchPage, ProductGrid } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import type { Product, ProductStatus } from "../interfaces";

export const ProductPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // * Theme
  const { colors, isDark } = useTheme();

  // * Datos de ejemplo (en el futuro vendrán de un hook/servicio)
  const products: Product[] = [
    {
      id: "1",
      name: 'Combo Familiar Deluxe',
      description: 'Combo completo para toda la familia con pollo, papas, ensalada y bebida',
      category: 'Combos',
      price: 45000,
      status: 'Activo',
      stock: 15,
      sku: 'COMBO-001',
      isFeatured: true,
      imageUrl: 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: "2",
      name: 'Pollo Broaster Especial',
      description: 'Pollo broaster marinado con especias secretas, crujiente por fuera y jugoso por dentro',
      category: 'Pollo',
      price: 35000,
      status: 'Activo',
      stock: 8,
      sku: 'POLLO-002',
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: "3",
      name: 'Alitas BBQ Picantes',
      description: 'Alitas de pollo con salsa BBQ picante, acompañadas de salsa ranch',
      category: 'Alitas',
      price: 28000,
      status: 'Activo',
      stock: 12,
      sku: 'ALITAS-003',
      imageUrl: 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: "4",
      name: 'Nuggets Kids',
      description: 'Nuggets de pollo especiales para niños, suaves y deliciosos',
      category: 'Infantil',
      price: 18000,
      status: 'Activo',
      stock: 20,
      sku: 'KIDS-004',
      imageUrl: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: "5",
      name: 'Hamburguesa Clásica',
      description: 'Hamburguesa con carne de res, queso, lechuga, tomate y salsa especial',
      category: 'Combos',
      price: 25000,
      status: 'Activo',
      stock: 5,
      sku: 'BURGER-005',
      imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: "6",
      name: 'Papas Fritas Extra',
      description: 'Papas fritas crujientes con sal marina, porción extra grande',
      category: 'Acompañantes',
      price: 12000,
      status: 'Agotado',
      stock: 0,
      sku: 'PAPAS-006',
      imageUrl: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: "7",
      name: 'Coca Cola 500ml',
      description: 'Refresco Coca Cola en botella de 500ml, bien fría',
      category: 'Bebidas',
      price: 8000,
      status: 'Activo',
      stock: 50,
      sku: 'COCA-007',
      imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      id: "8",
      name: 'Ensalada César',
      description: 'Ensalada fresca con lechuga, pollo, crutones, queso parmesano y aderezo césar',
      category: 'Acompañantes',
      price: 22000,
      status: 'Inactivo',
      stock: 3,
      sku: 'ENSALADA-008',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    }
  ];

  // * Filtrar productos basado en los filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         product.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // * Memoizar el callback del botón
  const handleOpenModal = useCallback(() => {
    setShowCreateProduct(true);
  }, []);

  // * Handlers para acciones
  const handleEditProduct = useCallback((product: Product) => {
    console.log('Editar producto:', product);
    // TODO: Implementar lógica de edición
  }, []);

  const handleDeleteProduct = useCallback((product: Product) => {
    console.log('Eliminar producto:', product);
    // TODO: Implementar lógica de eliminación
  }, []);

  // * Estadísticas rápidas
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Activo').length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Package className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Gestión de Productos
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus className="w-5 h-5 mr-2 text-[#2309095c]" />
          <span className="text-[#08080865] font-bold">Agregar Producto</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Total Productos
              </p>
              <p className={`text-2xl font-bold ${colors.text.primary}`}>
                {totalProducts}
              </p>
            </div>
            <Package className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Activos
              </p>
              <p className={`text-2xl font-bold text-green-600`}>
                {activeProducts}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 text-green-600`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Agotados
              </p>
              <p className={`text-2xl font-bold text-red-600`}>
                {outOfStockProducts}
              </p>
            </div>
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Valor Total
              </p>
              <p className={`text-lg font-bold ${colors.text.primary}`}>
                ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(totalValue)}
              </p>
            </div>
            <svg className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <ProductSearchPage
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Products Grid */}
      <ProductGrid 
        products={filteredProducts}
        viewMode={viewMode}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Create Product Modal - TODO: Convertir a componente reutilizable */}
      {showCreateProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'} flex items-center justify-between sticky top-0 ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold ${colors.text.primary}`}>Agregar Producto</h2>
              <button
                onClick={() => setShowCreateProduct(false)}
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
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="Ej: Combo Familiar"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Descripción
                </label>
                <textarea
                  rows={3}
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="Descripción del producto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                    Precio
                  </label>
                  <input
                    type="number"
                    className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                    Stock
                  </label>
                  <input
                    type="number"
                    className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Categoría
                </label>
                <select className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}>
                  <option value="">Seleccionar categoría</option>
                  <option value="Combos">Combos</option>
                  <option value="Pollo">Pollo</option>
                  <option value="Alitas">Alitas</option>
                  <option value="Infantil">Infantil</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Acompañantes">Acompañantes</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  SKU
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="Ej: PROD-001"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateProduct(false)}
                  className={`flex-1 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-[#334155] text-[#94A3B8] hover:bg-[#334155]' : 'border-[#E5E7EB] text-gray-700 hover:bg-gray-50'} transition-all duration-200`}
                >
                  Cancelar
                </button>
                <button className={`flex-1 px-4 py-2 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-lg transition-all duration-200`}>
                  Guardar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};