import { useState } from 'react';
import { Download, TrendingUp, PieChart, Users, CreditCard } from 'lucide-react';

export const ReportPage = () => {
  const [dateRange, setDateRange] = useState('today');

  const salesData = {
    total: 1250000,
    orders: 87,
    avgTicket: 14367,
    growth: 12
  };

  const paymentMethods = [
    { method: 'Efectivo', amount: 650000, percentage: 52 },
    { method: 'Tarjeta', amount: 425000, percentage: 34 },
    { method: 'Transferencia', amount: 175000, percentage: 14 }
  ];

  const topProducts = [
    { name: 'Combo Familiar', sales: 45, revenue: 675000 },
    { name: 'Pollo Broaster', sales: 38, revenue: 418000 },
    { name: 'Alitas BBQ', sales: 32, revenue: 288000 },
    { name: 'Nuggets Kids', sales: 24, revenue: 192000 }
  ];

  const topCustomers = [
    { name: 'Ana Martínez', orders: 22, total: 650000 },
    { name: 'María González', orders: 15, total: 425000 },
    { name: 'Luis Pérez', orders: 12, total: 320000 },
    { name: 'Carlos Rodríguez', orders: 8, total: 180000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reportes y Análisis</h1>
        <div className="flex items-center space-x-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="custom">Rango Personalizado</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+{salesData.growth}%</span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${salesData.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-50">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">+8%</span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Total Órdenes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{salesData.orders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-orange-50">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-600">+3%</span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${salesData.avgTicket.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-50">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">+25%</span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Nuevos Clientes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Hora</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[8, 12, 15, 22, 28, 35, 42, 38, 45, 52, 48, 41].map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-xs text-gray-500">${(value * 15000).toLocaleString()}</span>
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-sm"
                  style={{ height: `${(value / 52) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{8 + index}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Métodos de Pago</h2>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="font-medium text-gray-800">{method.method}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">${method.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{method.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total:</span>
              <span className="text-green-600">${salesData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Productos Más Vendidos</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} unidades</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">${product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mejores Clientes</h2>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.orders} órdenes</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">${customer.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
