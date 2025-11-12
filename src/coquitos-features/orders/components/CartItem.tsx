import { memo } from "react";
import { Trash2, Plus, Minus, Weight } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "../helpers";
import type { CartItem as CartItemType } from "../interfaces";

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string, batchId?: string) => void;
  onUpdateQuantity: (productId: string, quantity: number, batchId?: string) => void;
}

/**
 * Item individual del carrito
 * Muestra producto con controles de cantidad y botón de eliminar
 */
export const CartItem = memo(({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`${isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-white border-gray-200'} border-2 rounded-xl p-3 transition-all duration-200 hover:shadow-lg`}
    >
      {/* Info del producto */}
      <div className="flex items-start gap-3 mb-2">
        <img
          src={item.productImage}
          alt={item.productName}
          className="w-12 h-12 rounded-lg object-contain"
        />
        <div className="flex-1">
          <h4 className={`font-medium text-sm line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {item.productName}
          </h4>
          {item.isVariableWeight && (
            <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'} flex items-center gap-1`}>
              <Weight className="w-3 h-3" />
              {item.weight}kg - {item.batchCode}
            </p>
          )}
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {formatCurrency(item.unitPrice)} c/u
          </p>
        </div>
        <button
          onClick={() => onRemove(item.productId, item.batchId)}
          type="button"
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Controles de cantidad y total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (item.quantity > 1) {
                onUpdateQuantity(item.productId, item.quantity - 1, item.batchId);
              }
            }}
            type="button"
            className={`p-1 rounded-lg ${isDark ? 'bg-[#1E293B] hover:bg-[#334155]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className={`font-bold min-w-[40px] text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {item.quantity}
          </span>
          <button
            onClick={() => {
              // Validar que no exceda el stock disponible antes de aumentar
              if (item.quantity < item.availableStock) {
                onUpdateQuantity(item.productId, item.quantity + 1, item.batchId);
              } else {
                toast.error(`Stock insuficiente. Solo hay ${item.availableStock} disponible${item.availableStock === 1 ? '' : 's'}`);
              }
            }}
            type="button"
            disabled={item.quantity >= item.availableStock}
            className={`p-1 rounded-lg transition-colors ${
              item.quantity >= item.availableStock
                ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700'
                : isDark ? 'bg-[#1E293B] hover:bg-[#334155]' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className={`font-bold ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
          {formatCurrency(item.total)}
        </span>
      </div>
    </div>
  );
});

