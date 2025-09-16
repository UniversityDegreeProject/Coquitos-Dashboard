import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Phone, Mail } from 'lucide-react';

export const ClientsPage = () => {
  const [showCreateClient, setShowCreateClient] = useState(false);

  const clients = [
    {
      id: 1,
      name: 'María González',
      document: '1234567890',
      phone: '+57 300 123 4567',
      email: 'maria.gonzalez@email.com',
      totalOrders: 15,
      totalSpent: 425000
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      document: '0987654321',
      phone: '+57 301 987 6543',
      email: 'carlos.rodriguez@email.com',
      totalOrders: 8,
      totalSpent: 180000
    },
    {
      id: 3,
      name: 'Ana Martínez',
      document: '1122334455',
      phone: '+57 302 555 7777',
      email: 'ana.martinez@email.com',
      totalOrders: 22,
      totalSpent: 650000
    },
    {
      id: 4,
      name: 'Luis Pérez',
      document: '5544332211',
      phone: '+57 303 444 8888',
      email: 'luis.perez@email.com',
      totalOrders: 12,
      totalSpent: 320000
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => setShowCreateClient(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o teléfono..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">{client.name}</h3>
            <p className="text-sm text-gray-600 mb-3">CC: {client.document}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {client.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {client.email}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Órdenes</p>
                  <p className="text-lg font-semibold text-gray-800">{client.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Gastado</p>
                  <p className="text-lg font-semibold text-green-600">${client.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Client Modal */}
      {showCreateClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Agregar Cliente</h2>
              <button
                onClick={() => setShowCreateClient(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: María González"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula / NIT</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Teléfono</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="cliente@email.com"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateClient(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Guardar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
