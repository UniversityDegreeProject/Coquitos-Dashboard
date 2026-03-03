import { memo } from "react";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "../helpers";
import type { CashRegister } from "../interfaces";
import { SummaryRow } from "./SummaryRow";
import { PaymentMethodRow } from "./PaymentMethodRow";

interface DailySalesSummaryProps {
  cashRegister: CashRegister | null;
}

/**
 * Componente que muestra el resumen de ventas del día
 * Resumen financiero + Métodos de pago
 */
export const DailySalesSummary = memo(({ cashRegister }: DailySalesSummaryProps) => {
  const { isDark } = useTheme();

  if (!cashRegister) {
    return null;
  }

  const expectedTotal = cashRegister.openingAmount + cashRegister.totalSales;

  return (
    <div className={`${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-md border`}>
      <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Resumen de Ventas del Día
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumen Financiero */}
        <div className="space-y-4">
          <h3 className={`font-semibold text-base border-b pb-2 ${isDark ? 'text-gray-300 border-[#334155]' : 'text-gray-700 border-gray-200'}`}>
            Resumen Financiero
          </h3>
          
          <div className="space-y-3">
            <SummaryRow
              label="Monto Inicial:"
              value={formatCurrency(cashRegister.openingAmount)}
            />
            
            <SummaryRow
              label="Ventas del Día:"
              value={formatCurrency(cashRegister.totalSales)}
            />
            
            <SummaryRow
              label="Total Esperado:"
              value={formatCurrency(expectedTotal)}
              isBold
              isTotal
              valueColor="text-green-600"
            />
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="space-y-4">
          <h3 className={`font-semibold text-base border-b pb-2 ${isDark ? 'text-gray-300 border-[#334155]' : 'text-gray-700 border-gray-200'}`}>
            Métodos de Pago
          </h3>
          
          <div className="space-y-3">
            <PaymentMethodRow
              icon={Banknote}
              iconColor={isDark ? 'text-green-400' : 'text-green-600'}
              label="Efectivo:"
              value={formatCurrency(cashRegister.cashSales)}
            />
            
            <PaymentMethodRow
              icon={CreditCard}
              iconColor={isDark ? 'text-blue-400' : 'text-blue-600'}
              label="Tarjeta:"
              value={formatCurrency(cashRegister.cardSales)}
            />
            
            <PaymentMethodRow
              icon={Smartphone}
              iconColor={isDark ? 'text-purple-400' : 'text-purple-600'}
              label="QR:"
              value={formatCurrency(cashRegister.qrSales)}
            />
            
            <SummaryRow
              label="Total Recaudado:"
              value={formatCurrency(cashRegister.totalSales)}
              isBold
              isTotal
              valueColor="text-green-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
