import { memo } from "react";
import { formatDateTime } from "@/shared/helpers";
import { formatCurrency } from "../helpers";
import type { Sale } from "../interfaces";

interface SaleReceiptProps {
  sale: Sale;
}

/**
 * Componente de recibo imprimible para una venta
 * Se oculta visualmente pero se imprime cuando se llama window.print()
 */
export const SaleReceipt = memo(({ sale }: SaleReceiptProps) => {
  const customerName = sale.customer
    ? `${sale.customer.firstName} ${sale.customer.lastName}`
    : "Cliente no disponible";

  const userName = sale.user
    ? `${sale.user.firstName} ${sale.user.lastName}`
    : "Usuario no disponible";

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return formatDateTime(date);
  };

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              margin: 1cm;
              size: A4;
            }
            
            body * {
              visibility: hidden;
            }
            
            #sale-receipt-print-container,
            #sale-receipt-print-container * {
              visibility: visible !important;
            }
            
            #sale-receipt-print-container {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              background: white !important;
              color: black !important;
              display: block !important;
            }
            
            header,
            nav,
            aside,
            footer,
            button,
            .no-print {
              display: none !important;
              visibility: hidden !important;
            }
          }
        `}
      </style>
      <div
        id="sale-receipt-print-container"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "210mm",
          minHeight: "297mm",
          background: "white",
          color: "black",
          padding: "1cm",
        }}
      >
        <div className="p-8 bg-white text-black">
          {/* Encabezado del recibo */}
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-3xl font-bold mb-2">RECIBO DE VENTA</h1>
            <p className="text-lg">Número: {sale.saleNumber || "N/A"}</p>
          </div>

          {/* Información de la venta */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">Fecha:</span>
              <span>{formatDate(sale.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Cliente:</span>
              <span>{customerName}</span>
            </div>
            {sale.customer?.email && (
              <div className="flex justify-between">
                <span className="font-semibold">Email:</span>
                <span>{sale.customer.email}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold">Vendedor:</span>
              <span>{userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Método de Pago:</span>
              <span>{sale.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Estado:</span>
              <span>{sale.status || "Pendiente"}</span>
            </div>
          </div>

          {/* Items de la venta */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3 border-b border-black pb-2">
              Productos
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 px-2">Producto</th>
                  <th className="text-center py-2 px-2">Cantidad</th>
                  <th className="text-right py-2 px-2">Precio Unit.</th>
                  <th className="text-right py-2 px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-gray-300"
                    >
                      <td className="py-2 px-2">
                        {item.product?.name || "Producto no disponible"}
                      </td>
                      <td className="text-center py-2 px-2">{item.quantity}</td>
                      <td className="text-right py-2 px-2">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No hay productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen financiero */}
          <div className="mb-6 border-t-2 border-black pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Subtotal:</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Impuestos:</span>
              <span>{formatCurrency(sale.tax)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t-2 border-black pt-2 mt-2">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold">Monto Pagado:</span>
              <span>{formatCurrency(sale.amountPaid)}</span>
            </div>
            {sale.change > 0 && (
              <div className="flex justify-between">
                <span className="font-semibold">Cambio:</span>
                <span>{formatCurrency(sale.change)}</span>
              </div>
            )}
          </div>

          {/* Notas */}
          {sale.notes && (
            <div className="mt-6 border-t border-black pt-4">
              <p className="font-semibold mb-2">Notas:</p>
              <p className="text-sm">{sale.notes}</p>
            </div>
          )}

          {/* Pie de página */}
          <div className="mt-8 text-center text-sm border-t border-black pt-4">
            <p>Gracias por su compra</p>
            <p className="mt-2">Fecha de impresión: {formatDate(new Date())}</p>
          </div>
        </div>
      </div>
    </>
  );
});

SaleReceipt.displayName = "SaleReceipt";
