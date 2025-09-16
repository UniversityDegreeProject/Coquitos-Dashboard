import { TrendingUp, ShoppingBag, Users, DollarSign, Clock, Star } from 'lucide-react';

export const DashboardPage = () => {
  const kpis = [
    { 
      title: 'Ventas del Día', 
      value: '$125,450', 
      change: '+12%', 
      icon: DollarSign, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Órdenes del Día', 
      value: '87', 
      change: '+8%', 
      icon: ShoppingBag, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Ticket Promedio', 
      value: '$14,420', 
      change: '+3%', 
      icon: TrendingUp, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Clientes Nuevos', 
      value: '12', 
      change: '+25%', 
      icon: Users, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const topProducts = [
    { name: 'Combo Familiar', sales: 45, revenue: '$67,500' },
    { name: 'Pollo Broaster', sales: 38, revenue: '$41,800' },
    { name: 'Alitas BBQ', sales: 32, revenue: '$28,800' },
    { name: 'Nuggets Kids', sales: 24, revenue: '$19,200' },
    { name: 'Ensalada Caesar', sales: 18, revenue: '$14,400' }
  ];

  const recentOrders = [
    { id: '#1245', client: 'María González', total: '$18,500', status: 'Completada', time: '14:30' },
    { id: '#1244', client: 'Carlos Rodríguez', total: '$25,000', status: 'En Preparación', time: '14:25' },
    { id: '#1243', client: 'Ana Martínez', total: '$12,300', status: 'Lista', time: '14:20' },
    { id: '#1242', client: 'Luis Pérez', total: '$31,200', status: 'Completada', time: '14:15' },
    { id: '#1241', client: 'Sofia Herrera', total: '$16,800', status: 'Completada', time: '14:10' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={`text-sm font-medium ${kpi.color}`}>{kpi.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Hora</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[8, 12, 15, 22, 28, 35, 42, 38, 45, 52, 48, 41].map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-sm"
                  style={{ height: `${(value / 52) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{8 + index}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Productos Más Vendidos</h2>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} unidades</p>
                </div>
                <span className="font-semibold text-green-600">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Últimas Órdenes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Orden</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Completada' ? 'bg-green-100 text-green-800' :
                      order.status === 'En Preparación' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Lista' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};