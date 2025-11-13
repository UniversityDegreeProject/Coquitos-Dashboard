import { memo, useMemo } from "react";
import { Star } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useGetOrders } from "@/coquitos-features/orders/hooks/useGetOrders";
import { formatCurrency } from "@/coquitos-features/orders/helpers/format-currency";
import type { Order } from "@/coquitos-features/orders/interfaces";

interface TopProduct {
  name: string;
  sales: number; // Cantidad de unidades vendidas
  revenue: number; // Ingresos totales
}

/**
 * Componente de productos más vendidos
 * Calcula los productos más vendidos del día actual basado en los items de las órdenes
 */
export const TopProductsSection = memo(() => {
  const { isDark } = useTheme();

  // Calcular fechas del día actual
  const todayDates = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      startDate: startOfDay,
      endDate: endOfDay,
    };
  }, []);

  // Obtener órdenes completadas del día actual (máximo 100 según limitación del backend)
  const { orders, isLoading } = useGetOrders({
    page: 1,
    limit: 100, // Máximo permitido por el backend
    status: "Completado",
    startDate: todayDates.startDate,
    endDate: todayDates.endDate,
  });

  // Calcular productos más vendidos
  const topProducts = useMemo(() => {
    const productMap: Record<string, { name: string; sales: number; revenue: number }> = {};

    // Procesar todas las órdenes y sus items
    orders.forEach((order: Order) => {
      // Verificar que la orden tenga items
      if (!order.items || order.items.length === 0) return;

      order.items.forEach((item) => {
        // Verificar que el item tenga productId
        if (!item.productId) return;

        const productId = item.productId;
        
        // Obtener nombre del producto
        const productName = item.product?.name || `Producto ${productId.substring(0, 8)}...`;

        // Inicializar o actualizar el producto en el mapa
        if (!productMap[productId]) {
          productMap[productId] = {
            name: productName,
            sales: 0,
            revenue: 0,
          };
        }

        // Acumular ventas y revenue
        productMap[productId].sales += item.quantity || 0;
        productMap[productId].revenue += item.total || 0;
      });
    });

    // Convertir a array y ordenar por cantidad de ventas (descendente)
    const productsArray: TopProduct[] = Object.values(productMap)
      .filter((p) => p.sales > 0) // Solo productos con ventas
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5) // Top 5 productos
      .map((p) => ({
        name: p.name,
        sales: p.sales,
        revenue: p.revenue,
      }));

    return productsArray;
  }, [orders]);

  if (isLoading) {
    return (
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            Productos Más Vendidos
          </h2>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className={`h-4 w-32 rounded mb-2 animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                <div className={`h-3 w-20 rounded animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
              <div className={`h-4 w-24 rounded animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topProducts.length === 0 && !isLoading) {
    // Verificar si hay órdenes pero sin items
    const hasOrdersWithoutItems = orders.length > 0 && orders.every((order) => !order.items || order.items.length === 0);
    
    return (
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            Productos Más Vendidos
          </h2>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {hasOrdersWithoutItems 
              ? "Las órdenes no incluyen información de productos" 
              : "No hay productos vendidos aún"}
          </p>
          {hasOrdersWithoutItems && (
            <p className={`text-xs mt-2 ${isDark ? "text-gray-600" : "text-gray-500"}`}>
              Revisa la consola para más detalles
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-6 shadow-sm border ${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
          Productos Más Vendidos
        </h2>
        <Star className="w-5 h-5 text-yellow-500" />
      </div>
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-200 dark:border-[#334155]"
          >
            <div className="flex-1">
              <p className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}>{product.name}</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {product.sales} {product.sales === 1 ? "unidad" : "unidades"}
              </p>
            </div>
            <span className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
              {formatCurrency(product.revenue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

