import { useState } from 'react';
import { Plus, Search, Eye, Printer, X, ShoppingCart } from 'lucide-react';

export const OrdersPage = () => {
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);

  const orders = [
    { id: '#1245', client: 'María González', time: '14:30', total: '$18,500', status: 'Completada' },
    { id: '#1244', client: 'Carlos Rodríguez', time: '14:25', total: '$25,000', status: 'En Preparación' },
    { id: '#1243', client: 'Ana Martínez', time: '14:20', total: '$12,300', status: 'Lista para Entregar' },
    { id: '#1242', client: 'Luis Pérez', time: '14:15', total: '$31,200', status: 'Completada' },
    { id: '#1241', client: 'Sofia Herrera', time: '14:10', total: '$16,800', status: 'Pendiente' }
  ];

  const products = [
    { id: 1, name: 'Combo Familiar', price: 45000, category: 'Combos', image: 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
    { id: 2, name: 'Pollo Broaster', price: 35000, category: 'Pollo', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
    { id: 3, name: 'Alitas BBQ', price: 28000, category: 'Alitas', image: 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
    { id: 4, name: 'Nuggets Kids', price: 18000, category: 'Infantil', image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' }
  ];

  const addToOrder = (product: any) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setOrderTotal(orderTotal + product.price);
  };

  const removeFromOrder = (productId: number) => {
    const product = selectedProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
      setOrderTotal(orderTotal - (product.price * product.quantity));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'En Preparación': return 'bg-yellow-100 text-yellow-800';
      case 'Lista para Entregar': return 'bg-blue-100 text-blue-800';
      case 'Pendiente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Órdenes</h1>
        <button
          onClick={() => setShowCreateOrder(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear Nueva Orden
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente o ID de orden..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="preparing">En Preparación</option>
            <option value="ready">Lista para Entregar</option>
            <option value="completed">Completada</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Órdenes del Día</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Crear Nueva Orden</h2>
              <button
                onClick={() => {
                  setShowCreateOrder(false);
                  setSelectedProducts([]);
                  setOrderTotal(0);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products Grid */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Productos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addToOrder(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-gray-800">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-lg font-bold text-orange-600 mt-2">${product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <ShoppingCart className="w-5 h-5 text-orange-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Resumen del Pedido</h3>
                </div>

                <div className="space-y-3 mb-4">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {product.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">${(product.price * product.quantity).toLocaleString()}</span>
                        <button
                          onClick={() => removeFromOrder(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProducts.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No hay productos seleccionados</p>
                )}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">${orderTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="">Seleccionar Cliente</option>
                    <option value="new">+ Nuevo Cliente</option>
                  </select>

                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="">Método de Pago</option>
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="transfer">Transferencia</option>
                  </select>

                  <button 
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
                    disabled={selectedProducts.length === 0}
                  >
                    Confirmar Orden
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
