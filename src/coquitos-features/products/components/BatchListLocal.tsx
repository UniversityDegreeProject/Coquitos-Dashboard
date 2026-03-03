import { memo } from "react";
import { Trash2, Clock } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatExpirationDate, getDaysUntilExpiration } from "../helpers";
import type { PendingBatch } from "../interfaces";

interface BatchListLocalProps {
  batches: PendingBatch[];
  onDeleteBatch: (tempId: string) => void;
}

/**
 * Componente para mostrar lista de batches temporales durante la creación del producto
 * Similar a BatchList pero para batches pendientes (sin id ni batchCode)
 */
export const BatchListLocal = memo(({ batches, onDeleteBatch }: BatchListLocalProps) => {
  const { isDark } = useTheme();

  // Estado vacío
  if (batches.length === 0) {
    return (
      <div className={`text-center py-8 rounded-lg border border-dashed ${isDark ? 'border-[#334155] bg-[#0F172A]/30' : 'border-gray-300 bg-gray-50'}`}>
        <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Aún no hay batches agregados
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-[#64748B]' : 'text-gray-500'}`}>
          Agrega batches para este producto antes de guardar
        </p>
      </div>
    );
  }

  // Lista de batches temporales
  return (
    <div className="space-y-2">
      {batches.map((batch) => {
        const daysUntilExpiration = batch.expirationDate 
          ? getDaysUntilExpiration(batch.expirationDate) 
          : null;
        const isNearExpiration = daysUntilExpiration !== null && daysUntilExpiration >= 2 && daysUntilExpiration <= 4;
        const isExpiringTomorrow = daysUntilExpiration === 1;
        const isExpiringToday = daysUntilExpiration === 0;

        return (
          <div
            key={batch.tempId}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              isDark ? 'bg-[#0F172A]/50 border-[#334155]' : 'bg-gray-50 border-gray-200'
            } hover:${isDark ? 'bg-[#1E293B]' : 'bg-gray-100'} transition-colors`}
          >
            {/* Información del batch */}
            <div className="flex-1">
              <div className={`flex items-center gap-2 mb-1`}>
                <span className={`font-mono text-sm font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
                  Lote pendiente
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                  isDark ? 'bg-blue-900/30 text-blue-300 border border-blue-700/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  Pendiente
                </span>
              </div>
              <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                <span>Peso: {batch.weight.toFixed(3)} kg</span>
                <span>•</span>
                <span>Precio: Bs {batch.unitPrice.toFixed(2)}</span>
                <span>•</span>
                <span className="font-semibold">Stock: 1 ud.</span>
                {batch.expirationDate && (
                  <>
                    <span>•</span>
                    <span className={`flex items-center gap-1 ${
                      isExpiringToday 
                        ? 'text-red-600 font-semibold' 
                        : isExpiringTomorrow 
                        ? 'text-orange-500 font-semibold'
                        : isNearExpiration 
                        ? 'text-red-500 font-semibold' 
                        : ''
                    }`}>
                      <Clock className={`w-3 h-3 ${
                        isExpiringToday 
                          ? 'text-red-600' 
                          : isExpiringTomorrow 
                          ? 'text-orange-500'
                          : isNearExpiration 
                          ? 'text-red-500' 
                          : ''
                      }`} />
                      Vence: {formatExpirationDate(batch.expirationDate)}
                      {daysUntilExpiration !== null && daysUntilExpiration <= 1 && (
                        <span className={`font-bold ${
                          isExpiringToday ? 'text-red-600' : 'text-orange-500'
                        }`}>
                          {isExpiringToday ? ' (Hoy)' : ' (Mañana)'}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Botón eliminar */}
            <button
              type="button"
              onClick={() => onDeleteBatch(batch.tempId)}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
              }`}
              title="Eliminar batch"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
});

BatchListLocal.displayName = "BatchListLocal";

