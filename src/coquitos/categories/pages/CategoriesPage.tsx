import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

export const CategoriesPage = () => {
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  const categories = [
    { id: 1, name: 'Combos', description: 'Combos familiares e individuales', products: 8 },
    { id: 2, name: 'Pollo', description: 'Pollo broaster y frito tradicional', products: 12 },
    { id: 3, name: 'Alitas', description: 'Alitas en diferentes salsas', products: 6 },
    { id: 4, name: 'Infantil', description: 'Productos para niños', products: 4 },
    { id: 5, name: 'Bebidas', description: 'Refrescos, jugos y bebidas calientes', products: 15 },
    { id: 6, name: 'Acompañantes', description: 'Papas, ensaladas y extras', products: 10 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        <button
          onClick={() => setShowCreateCategory(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Categoría
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar categorías..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{category.products} productos</span>
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Agregar Categoría</h2>
              <button
                onClick={() => setShowCreateCategory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: Combos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Descripción de la categoría..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateCategory(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
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