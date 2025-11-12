import { memo } from "react";
import { type SearchOrdersParams, type Order } from "../interfaces";
import { GenericGridLoader } from "@/shared/components";
import { OrderEmptyState } from "./OrderEmptyState";
import { OrderListItem } from "./OrderListItem";

interface OrderGridProps {
  orders: Order[];
  isPending: boolean;
  currentParams: SearchOrdersParams;
  onPageEmpty?: () => void;
}

/**
 * Componente que muestra las órdenes en formato de lista moderna
 * Maneja estados de carga, vacío y renderizado de items
 */
export const OrderGrid = memo(({ orders, isPending, currentParams, onPageEmpty }: OrderGridProps) => {
  // Mostrar loader durante la carga
  if (isPending) {
    return <GenericGridLoader title="Cargando órdenes" />;
  }

  // Mostrar estado vacío cuando no hay órdenes
  if (orders.length === 0) {
    return <OrderEmptyState />;
  }

  // Renderizar lista de órdenes
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderListItem 
          key={order.id} 
          order={order} 
          currentParams={currentParams} 
          onPageEmpty={onPageEmpty} 
        />
      ))}
    </div>
  );
});

