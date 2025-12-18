import { memo } from "react";
import { ShoppingCart } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { CartItem } from "./CartItem";
import type { CartItem as CartItemType } from "../interfaces";

interface CartSectionProps {
  cartItems: CartItemType[];
  onRemoveItem: (productId: string, batchId?: string) => void;
  onUpdateQuantity: (productId: string, quantity: number, batchId?: string) => void;
}

/**
 * Sección del carrito de compras
 * Muestra lista de items con scroll independiente
 */
export const CartSection = memo(({ cartItems, onRemoveItem, onUpdateQuantity }: CartSectionProps) => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col">
      {/* Header del carrito */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Carrito
          </h3>
        </div>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items del carrito */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <ShoppingCart className={`w-16 h-16 ${isDark ? 'text-gray-700' : 'text-gray-300'} mb-4`} />
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            El carrito está vacío
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cartItems.map((item, index) => (
            <CartItem
              key={`${item.productId}-${item.batchId || index}`}
              item={item}
              onRemove={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
});

