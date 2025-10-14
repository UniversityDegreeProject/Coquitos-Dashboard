import { useState } from 'react';
import { Calculator, Printer, AlertTriangle, CheckCircle, DollarSign, CreditCard, Smartphone } from 'lucide-react';

export const CashClosePage = () => {
  const [showCloseModal, setShowCloseModal] = useState(false);

  const todaySummary = {
    date: new Date().toLocaleDateString(),
    startTime: '08:00',
    endTime: new Date().toLocaleTimeString(),
    user: 'Admin Principal',
    totalOrders: 87,
    grossSales: 1250000,
    discounts: 35000,
    netSales: 1215000,
    cash: 650000,
    card: 425000,
    transfer: 175000
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Cierre de Caja</h1>
        <div className="flex items-center text-sm text-gray-500">
          <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
          Asegúrate de completar todas las órdenes antes del cierre
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Estado Actual de la Caja</h2>
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Operativa</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Turno Iniciado</p>
            <p className="text-lg font-semibold text-gray-800">{todaySummary.startTime}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Órdenes Procesadas</p>
            <p className="text-lg font-semibold text-gray-800">{todaySummary.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Ventas Acumuladas</p>
            <p className="text-lg font-semibold text-green-600">${todaySummary.grossSales.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Resumen de Ventas del Día</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Financial Summary */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 border-b pb-2">Resumen Financiero</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ventas Brutas:</span>
                <span className="font-semibold text-gray-800">${todaySummary.grossSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Descuentos:</span>
                <span className="font-semibold text-red-600">-${todaySummary.discounts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-gray-800">Ventas Netas:</span>
                <span className="font-bold text-green-600 text-lg">${todaySummary.netSales.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 border-b pb-2">Métodos de Pago</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-600">Efectivo:</span>
                </div>
                <span className="font-semibold text-gray-800">${todaySummary.cash.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-600">Tarjeta:</span>
                </div>
                <span className="font-semibold text-gray-800">${todaySummary.card.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-gray-600">Transferencia:</span>
                </div>
                <span className="font-semibold text-gray-800">${todaySummary.transfer.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-gray-800">Total Recaudado:</span>
                <span className="font-bold text-green-600 text-lg">${(todaySummary.cash + todaySummary.card + todaySummary.transfer).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">¿Listo para cerrar la caja?</h3>
            <p className="text-sm text-gray-600 mt-1">Esta acción generará el reporte final y cerrará las operaciones del día.</p>
          </div>
          <button
            onClick={() => setShowCloseModal(true)}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Realizar Cierre de Caja
          </button>
        </div>
      </div>

      {/* Close Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Confirmación de Cierre de Caja</h2>
              <p className="text-sm text-gray-600 mt-1">Revisa cuidadosamente los datos antes de confirmar</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Fecha:</span>
                    <span className="ml-2 font-medium">{todaySummary.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hora de Cierre:</span>
                    <span className="ml-2 font-medium">{todaySummary.endTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Usuario:</span>
                    <span className="ml-2 font-medium">{todaySummary.user}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Órdenes:</span>
                    <span className="ml-2 font-medium">{todaySummary.totalOrders}</span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Resumen Financiero</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Ventas Brutas:</span>
                    <span>${todaySummary.grossSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Descuentos:</span>
                    <span>-${todaySummary.discounts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Ventas Netas:</span>
                    <span className="text-green-600">${todaySummary.netSales.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Desglose por Método de Pago</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Efectivo:</span>
                    <span>${todaySummary.cash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarjeta:</span>
                    <span>${todaySummary.card.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transferencia/QR:</span>
                    <span>${todaySummary.transfer.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total Recaudado:</span>
                    <span className="text-green-600">${(todaySummary.cash + todaySummary.card + todaySummary.transfer).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Importante</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Una vez confirmado el cierre, no podrás modificar las transacciones del día. 
                      Asegúrate de que todos los datos sean correctos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Reporte
                </button>
                <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Confirmar y Cerrar Caja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
