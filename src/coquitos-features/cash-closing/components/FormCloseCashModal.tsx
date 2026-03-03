import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import {
  X,
  Lock,
  AlertTriangle,
  Printer,
  Banknote,
  Loader2,
  Smartphone,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCashRegisterStore } from "../store/cash-register.store";
import {
  closeCashRegisterSchema,
  type CloseCashRegisterSchema,
} from "../schemas";
import { useCloseCashRegister } from "../hooks";
import {
  formatDate,
  formatTime,
  formatCurrency,
  formatDifference,
} from "../helpers";
import { LabelTextarea } from "@/shared/components";
import type { CashRegister } from "../interfaces";
import { SummaryRow } from "./SummaryRow";
import { PaymentMethodRow } from "./PaymentMethodRow";

interface FormCloseCashModalProps {
  cashRegister: CashRegister;
}

/**
 * Modal para cerrar caja
 * Muestra resumen completo y solicita monto final contado
 */
export const FormCloseCashModal = ({
  cashRegister,
}: FormCloseCashModalProps) => {
  // * Zustand
  const closeCloseCashModal = useCashRegisterStore(
    useShallow((state) => state.closeCloseCashModal),
  );

  // * Theme
  const { isDark } = useTheme();

  // * Hook mutation
  const { useCloseCashRegisterMutation, isPending } = useCloseCashRegister({
    onSuccessCallback: closeCloseCashModal,
  });

  // * React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CloseCashRegisterSchema>({
    resolver: zodResolver(closeCashRegisterSchema),
    defaultValues: {
      cashRegisterId: cashRegister.id,
      closingAmount: "",
      notes: "",
    },
    mode: "onChange",
  });

  const watchedClosingAmount = watch("closingAmount");
  const closingAmountNumber = parseFloat(watchedClosingAmount || "0");
  const expectedAmount = cashRegister.openingAmount + cashRegister.totalSales;
  const calculatedDifference = closingAmountNumber - expectedAmount;
  const differenceFormatted = formatDifference(calculatedDifference);

  const onSubmit: SubmitHandler<CloseCashRegisterSchema> = (data) => {
    closeCloseCashModal();

    useCloseCashRegisterMutation.mutate({
      cashRegisterId: data.cashRegisterId,
      closingAmount: parseFloat(data.closingAmount),
      notes: data.notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div
        className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border ${isDark ? "border-red-500/30" : "border-red-200"}`}
      >
        {/* Header */}
        <div
          className={`${isDark ? "bg-gradient-to-r from-red-900/30 via-[#1E293B] to-red-900/30" : "bg-gradient-to-r from-red-50 via-white to-red-50"} p-6 border-b ${isDark ? "border-[#334155]" : "border-gray-200"} rounded-t-3xl sticky top-0 z-10`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${isDark ? "bg-red-500/20 border border-red-500/30" : "bg-red-100 border border-red-300"} shadow-sm`}
              >
                <Lock
                  className={`w-7 h-7 ${isDark ? "text-red-400" : "text-red-600"}`}
                />
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Confirmación de Cierre de Caja
                </h2>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Revisa cuidadosamente los datos antes de confirmar
                </p>
              </div>
            </div>
            <button
              onClick={closeCloseCashModal}
              className={`p-2 ${isDark ? "text-gray-400 hover:text-white hover:bg-[#334155]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"} rounded-xl transition-all duration-200`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Info General */}
          <div
            className={`${isDark ? "bg-[#0F172A] border-[#334155]" : "bg-gray-50 border-gray-200"} rounded-xl p-4 border`}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Fecha:
                </span>
                <span
                  className={`ml-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {formatDate(new Date())}
                </span>
              </div>
              <div>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Hora de Cierre:
                </span>
                <span
                  className={`ml-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {formatTime(new Date())}
                </span>
              </div>
              <div>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Turno Iniciado:
                </span>
                <span
                  className={`ml-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {formatTime(cashRegister.openedAt)}
                </span>
              </div>
              <div>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Total Órdenes:
                </span>
                <span
                  className={`ml-2 font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {cashRegister.totalOrders}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen Financiero */}
          <div>
            <h3
              className={`font-bold text-base mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Resumen Financiero
            </h3>
            <div className="space-y-2 text-sm">
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
                value={formatCurrency(expectedAmount)}
                isBold
                isTotal
                valueColor="text-green-600"
              />
            </div>
          </div>

          {/* Métodos de Pago */}
          <div>
            <h3
              className={`font-bold text-base mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Desglose por Método de Pago
            </h3>
            <div className="space-y-2 text-sm">
              <PaymentMethodRow
                icon={Banknote}
                iconColor={isDark ? "text-green-400" : "text-green-600"}
                label="Efectivo:"
                value={formatCurrency(cashRegister.cashSales)}
              />

              <PaymentMethodRow
                icon={Smartphone}
                iconColor={isDark ? "text-purple-400" : "text-purple-600"}
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

          {/* Monto Final Contado */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Monto Final Contado (Bs.)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <Banknote
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"} z-10`}
              />
              <Controller
                name="closingAmount"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border ${isDark ? "bg-[#0F172A] border-[#334155] text-white placeholder-gray-500 focus:border-[#F59E0B]" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#275081]"} focus:ring-2 ring-offset-1 ${isDark ? "focus:ring-[#F59E0B]/20" : "focus:ring-[#275081]/20"} outline-none transition-all duration-200 text-lg font-semibold`}
                  />
                )}
              />
            </div>
            {errors.closingAmount && (
              <p className="text-red-500 text-xs font-medium">
                {errors.closingAmount.message}
              </p>
            )}

            {/* Mostrar diferencia calculada */}
            {closingAmountNumber > 0 && (
              <div
                className={`mt-2 p-3 rounded-lg ${Math.abs(calculatedDifference) < 0.01 ? "bg-green-500/10" : calculatedDifference > 0 ? "bg-blue-500/10" : "bg-red-500/10"}`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Diferencia:
                  </span>
                  <span
                    className={`text-base font-bold ${differenceFormatted.color}`}
                  >
                    {differenceFormatted.text}
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {Math.abs(calculatedDifference) < 0.01
                    ? "✅ Caja cuadrada"
                    : calculatedDifference > 0
                      ? "💰 Sobrante en caja"
                      : "⚠️ Faltante en caja"}
                </p>
              </div>
            )}
          </div>

          {/* Notas */}
          <LabelTextarea
            label="Notas del Cierre (Opcional)"
            name="notes"
            control={control}
            placeholder="Observaciones, incidencias, comentarios..."
            rows={3}
            error={errors.notes?.message}
          />

          {/* Advertencia */}
          <div
            className={`${isDark ? "bg-yellow-500/10 border-yellow-500/30" : "bg-yellow-50 border-yellow-200"} border rounded-xl p-4`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`w-5 h-5 mt-0.5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
              />
              <div>
                <h4
                  className={`font-bold text-sm ${isDark ? "text-yellow-300" : "text-yellow-800"}`}
                >
                  Importante
                </h4>
                <p
                  className={`text-xs mt-1 ${isDark ? "text-yellow-400" : "text-yellow-700"}`}
                >
                  Una vez confirmado el cierre, no podrás modificar las
                  transacciones del día. Asegúrate de que todos los datos sean
                  correctos.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeCloseCashModal}
              className={`flex-1 px-4 py-3 border ${isDark ? "border-[#334155] text-gray-300 hover:bg-[#334155]/50" : "border-gray-300 text-gray-700 hover:bg-gray-50"} rounded-xl transition-all duration-200 font-semibold`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className={`flex-1 px-4 py-3 border ${isDark ? "border-blue-500 text-blue-400 hover:bg-blue-500/10" : "border-blue-500 text-blue-600 hover:bg-blue-50"} rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2`}
            >
              <Printer className="w-4 h-4" />
              Imprimir Reporte
            </button>
            <button
              type="submit"
              disabled={isPending || !isValid}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isPending || !isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                    ? "bg-gradient-to-r from-red-700 to-red-500 hover:shadow-2xl hover:shadow-red-500/50"
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:shadow-2xl hover:shadow-red-500/50"
              } text-white shadow-md`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Cerrando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Confirmar y Cerrar Caja
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
