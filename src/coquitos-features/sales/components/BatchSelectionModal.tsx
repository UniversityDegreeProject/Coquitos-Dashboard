import { memo } from "react";
import { X, Loader2, Clock } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "../helpers";
import { formatExpirationDate, getDaysUntilExpiration } from "@/coquitos-features/products/helpers";
import type { Product } from "@/coquitos-features/products/interfaces";
import type { ProductBatch } from "@/coquitos-features/products/interfaces/product-batch.interface";

interface BatchSelectionModalProps {
  product: Product;
  batches: ProductBatch[];
  isLoading: boolean;
  onClose: () => void;
  onSelectBatch: (batch: ProductBatch) => void;
}

/**
 * Modal para seleccionar batch de productos de peso variable
 * Se muestra cuando el usuario hace click en un producto variable
 */
export const BatchSelectionModal = memo(({ 
  product, 
  batches, 
  isLoading, 
  onClose, 
  onSelectBatch 
}: BatchSelectionModalProps) => {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-2xl w-full max-w-2xl shadow-2xl border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Selecciona un Lote
            </h3>
            <button
              onClick={onClose}
              type="button"
              className={`p-2 ${isDark ? 'hover:bg-[#334155]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {product.name}
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No hay lotes disponibles para este producto
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {batches
                .filter((batch) => batch.stock > 0)
                .map((batch) => (
                  <button
                    key={batch.id}
                    onClick={() => onSelectBatch(batch)}
                    type="button"
                    className={`${isDark ? 'bg-[#0F172A] border-[#334155] hover:border-[#F59E0B]' : 'bg-gray-50 border-gray-200 hover:border-[#275081]'} border rounded-xl p-4 transition-all duration-200 hover:shadow-sm cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left flex-1">
                        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {batch.batchCode}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Peso: {batch.weight}kg | Stock: {batch.stock}
                        </p>
                        {batch.expirationDate && (() => {
                          const daysUntilExpiration = getDaysUntilExpiration(batch.expirationDate);
                          const isNearExpiration = daysUntilExpiration !== null && daysUntilExpiration <= 4 && daysUntilExpiration >= 0;
                          return (
                            <div className={`flex items-center gap-1 mt-1 ${isNearExpiration ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Clock className="w-3 h-3" />
                              <span className="text-xs font-medium">
                                Vence: {formatExpirationDate(batch.expirationDate)}
                                {daysUntilExpiration !== null && (
                                  <span className={isNearExpiration ? ' text-red-500 font-bold' : ''}>
                                    {daysUntilExpiration === 0 
                                      ? ' (Hoy)' 
                                      : daysUntilExpiration === 1 
                                      ? ' (Mañana)' 
                                      : ` (${daysUntilExpiration} días)`
                                    }
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="text-right ml-4">
                        <p className={`font-bold text-lg ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
                          {formatCurrency(batch.unitPrice)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

