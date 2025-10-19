//* Librerias
import { Plus, Users, TrendingUp, Crown } from "lucide-react";
import { useCallback, useState } from "react";

//* Others
import { ClientSearchPage, ClientGrid } from "../components";
import { useTheme } from "@/shared/hooks/useTheme";
import { useDebounce } from "@/coquitos-features/users/hooks/useDebounce";
import type { Client, ClientStatus, ClientType } from "../interfaces";

export const ClientsPage = () => {
  // * Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "">("");
  const [clientTypeFilter, setClientTypeFilter] = useState<ClientType | "">("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateClient, setShowCreateClient] = useState(false);

  // * Debounce para la búsqueda (500ms)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // * Theme
  const { colors, isDark } = useTheme();

  // * Datos de ejemplo (en el futuro vendrán de un hook/servicio)
  const clients: Client[] = [
    {
      id: "1",
      name: 'María González Rodríguez',
      document: '1234567890',
      documentType: 'CC',
      phone: '+57 300 123 4567',
      email: 'maria.gonzalez@email.com',
      address: 'Calle 123 #45-67, Bogotá',
      city: 'Bogotá',
      department: 'Cundinamarca',
      status: 'Activo',
      clientType: 'Cliente VIP',
      totalOrders: 25,
      totalSpent: 1250000,
      averageOrderValue: 50000,
      loyaltyPoints: 1250,
      lastOrderDate: new Date('2024-01-15'),
      firstOrderDate: new Date('2023-03-10'),
      birthday: new Date('1985-06-15'),
      preferences: {
        favoriteCategories: ['Combos', 'Bebidas'],
        allergies: ['Ninguna'],
        specialRequests: 'Sin cebolla en las hamburguesas'
      }
    },
    {
      id: "2",
      name: 'Carlos Rodríguez Silva',
      document: '0987654321',
      documentType: 'CC',
      phone: '+57 301 987 6543',
      email: 'carlos.rodriguez@email.com',
      address: 'Carrera 45 #78-90, Medellín',
      city: 'Medellín',
      department: 'Antioquia',
      status: 'Activo',
      clientType: 'Persona Natural',
      totalOrders: 12,
      totalSpent: 380000,
      averageOrderValue: 31667,
      loyaltyPoints: 380,
      lastOrderDate: new Date('2024-01-10'),
      firstOrderDate: new Date('2023-08-22'),
      birthday: new Date('1990-12-03'),
      preferences: {
        favoriteCategories: ['Pollo', 'Acompañantes'],
        allergies: ['Lactosa'],
        specialRequests: 'Papas sin sal'
      }
    },
    {
      id: "3",
      name: 'Ana Martínez López',
      document: '1122334455',
      documentType: 'CC',
      phone: '+57 302 555 7777',
      email: 'ana.martinez@email.com',
      address: 'Calle 67 #12-34, Cali',
      city: 'Cali',
      department: 'Valle del Cauca',
      status: 'Activo',
      clientType: 'Cliente VIP',
      totalOrders: 35,
      totalSpent: 2100000,
      averageOrderValue: 60000,
      loyaltyPoints: 2100,
      lastOrderDate: new Date('2024-01-20'),
      firstOrderDate: new Date('2022-11-05'),
      birthday: new Date('1988-04-20'),
      preferences: {
        favoriteCategories: ['Alitas', 'Bebidas', 'Acompañantes'],
        allergies: ['Gluten'],
        specialRequests: 'Alitas extra picantes'
      }
    },
    {
      id: "4",
      name: 'Luis Pérez García',
      document: '5544332211',
      documentType: 'CC',
      phone: '+57 303 444 8888',
      email: 'luis.perez@email.com',
      address: 'Carrera 23 #56-78, Barranquilla',
      city: 'Barranquilla',
      department: 'Atlántico',
      status: 'Inactivo',
      clientType: 'Persona Natural',
      totalOrders: 8,
      totalSpent: 180000,
      averageOrderValue: 22500,
      loyaltyPoints: 180,
      lastOrderDate: new Date('2023-11-15'),
      firstOrderDate: new Date('2023-06-10'),
      birthday: new Date('1992-09-12'),
      preferences: {
        favoriteCategories: ['Infantil'],
        allergies: ['Ninguna'],
        specialRequests: 'Ninguna'
      }
    },
    {
      id: "5",
      name: 'Restaurante El Buen Sabor S.A.S.',
      document: '900123456-1',
      documentType: 'NIT',
      phone: '+57 304 111 2222',
      email: 'ventas@elbuensabor.com',
      address: 'Calle 100 #15-30, Bogotá',
      city: 'Bogotá',
      department: 'Cundinamarca',
      status: 'Activo',
      clientType: 'Empresa',
      totalOrders: 45,
      totalSpent: 4500000,
      averageOrderValue: 100000,
      loyaltyPoints: 4500,
      lastOrderDate: new Date('2024-01-18'),
      firstOrderDate: new Date('2022-01-15'),
      preferences: {
        favoriteCategories: ['Combos', 'Pollo'],
        allergies: ['Ninguna'],
        specialRequests: 'Pedidos grandes para eventos'
      }
    },
    {
      id: "6",
      name: 'Sofia Herrera Castro',
      document: '9988776655',
      documentType: 'CC',
      phone: '+57 305 666 9999',
      email: 'sofia.herrera@email.com',
      address: 'Carrera 80 #45-67, Bucaramanga',
      city: 'Bucaramanga',
      department: 'Santander',
      status: 'Bloqueado',
      clientType: 'Persona Natural',
      totalOrders: 3,
      totalSpent: 75000,
      averageOrderValue: 25000,
      loyaltyPoints: 75,
      lastOrderDate: new Date('2023-09-20'),
      firstOrderDate: new Date('2023-08-15'),
      birthday: new Date('1995-02-28'),
      preferences: {
        favoriteCategories: ['Bebidas'],
        allergies: ['Ninguna'],
        specialRequests: 'Ninguna'
      }
    }
  ];

  // * Filtrar clientes basado en los filtros
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         client.document.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         client.phone.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         client.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesStatus = !statusFilter || client.status === statusFilter;
    const matchesClientType = !clientTypeFilter || client.clientType === clientTypeFilter;

    return matchesSearch && matchesStatus && matchesClientType;
  });

  // * Memoizar el callback del botón
  const handleOpenModal = useCallback(() => {
    setShowCreateClient(true);
  }, []);

  // * Handlers para acciones
  const handleEditClient = useCallback((client: Client) => {
    console.log('Editar cliente:', client);
    // TODO: Implementar lógica de edición
  }, []);

  const handleDeleteClient = useCallback((client: Client) => {
    console.log('Eliminar cliente:', client);
    // TODO: Implementar lógica de eliminación
  }, []);

  // * Estadísticas rápidas
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Activo').length;
  const vipClients = clients.filter(c => c.clientType === 'Cliente VIP').length;
  const totalRevenue = clients.reduce((sum, client) => sum + (client.totalSpent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
            <Users className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
            Gestión de Clientes
          </h3>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center px-6 py-3 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus className="w-5 h-5 mr-2 text-[#2309095c]" />
          <span className="text-[#08080865] font-bold">Agregar Cliente</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Total Clientes
              </p>
              <p className={`text-2xl font-bold ${colors.text.primary}`}>
                {totalClients}
              </p>
            </div>
            <Users className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Clientes Activos
              </p>
              <p className={`text-2xl font-bold text-green-600`}>
                {activeClients}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 text-green-600`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Clientes VIP
              </p>
              <p className={`text-2xl font-bold text-yellow-600`}>
                {vipClients}
              </p>
            </div>
            <Crown className={`w-8 h-8 text-yellow-600`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                Ingresos Totales
              </p>
              <p className={`text-lg font-bold ${colors.text.primary}`}>
                ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(totalRevenue)}
              </p>
            </div>
            <svg className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <ClientSearchPage
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        clientTypeFilter={clientTypeFilter}
        onClientTypeChange={setClientTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Clients Grid */}
      <ClientGrid 
        clients={filteredClients}
        viewMode={viewMode}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />

      {/* Create Client Modal - TODO: Convertir a componente reutilizable */}
      {showCreateClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'} flex items-center justify-between sticky top-0 ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold ${colors.text.primary}`}>Agregar Cliente</h2>
              <button
                onClick={() => setShowCreateClient(false)}
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
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="Ej: María González"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                    Tipo de Documento
                  </label>
                  <select className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Número de Teléfono
                </label>
                <input
                  type="tel"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="cliente@email.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Dirección
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}
                  placeholder="Calle 123 #45-67, Ciudad"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${colors.text.secondary}`}>
                  Tipo de Cliente
                </label>
                <select className={`w-full px-3 py-2 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'bg-white border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-4 outline-none transition-all duration-200 ${colors.text.primary}`}>
                  <option value="Persona Natural">Persona Natural</option>
                  <option value="Empresa">Empresa</option>
                  <option value="Cliente VIP">Cliente VIP</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateClient(false)}
                  className={`flex-1 px-4 py-2 rounded-xl border-2 ${isDark ? 'border-[#334155] text-[#94A3B8] hover:bg-[#334155]' : 'border-[#E5E7EB] text-gray-700 hover:bg-gray-50'} transition-all duration-200`}
                >
                  Cancelar
                </button>
                <button className={`flex-1 px-4 py-2 bg-gradient-to-r ${colors.gradient.accent} text-white rounded-xl hover:shadow-lg transition-all duration-200`}>
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
