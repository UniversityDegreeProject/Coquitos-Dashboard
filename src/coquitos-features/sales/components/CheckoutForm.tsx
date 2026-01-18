import { memo } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import {
  Loader2,
  ShoppingCart,
  User,
  CreditCard,
  Coins,
  StickyNote,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { LabelSelect, LabelTextarea } from "@/shared/components";
import { formatCurrency } from "../helpers";
import type { CreateSaleSchema } from "../schemas";
import type { PaymentMethod } from "../interfaces";

interface CheckoutFormProps {
  control: Control<CreateSaleSchema>;
  errors: FieldErrors<CreateSaleSchema>;
  isValid: boolean;
  isPending: boolean;
  cartTotal: number;
  amountPaid: number;
  change: number;
  isPaymentSufficient: boolean;
  cartItemsCount: number;
  hasCashRegister: boolean;
  clientOptions: { label: string; value: string }[];
  isLoadingClients: boolean;
  paymentMethodOptions: { value: PaymentMethod; label: string }[];
  onSubmit: () => void;

  //* Revisar aqui
  onGenerateQR: () => void;
  qrUrl: string | null;
  isQrLoading: boolean;
  isPaid: boolean;
}

/**
 * Formulario de checkout (pago)
 * Incluye: Resumen, Cliente, Método de Pago, Monto, Notas, Botón Submit
 */
export const CheckoutForm = memo(
  ({
    control,
    errors,
    isValid,
    isPending,
    cartTotal,
    amountPaid,
    change,
    isPaymentSufficient,
    cartItemsCount,
    hasCashRegister,
    clientOptions,
    isLoadingClients,
    paymentMethodOptions,
    onSubmit,
    onGenerateQR,
    qrUrl,
    isQrLoading,
    isPaid,
  }: CheckoutFormProps) => {
    const { isDark } = useTheme();

    // * Revisar aqui
    const selectedPaymentMethod = useWatch({
      control,
      name: "paymentMethod",
    });

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        {/* Resumen de totales */}
        <div
          className={`${
            isDark
              ? "bg-[#0F172A] border-[#334155]"
              : "bg-gray-50 border-gray-200"
          } border-2 rounded-xl p-4`}
        >
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                Subtotal:
              </span>
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <div
              className={`flex justify-between text-lg font-bold border-t-2 ${
                isDark ? "border-[#334155]" : "border-gray-300"
              } pt-2`}
            >
              <span className={isDark ? "text-white" : "text-gray-900"}>
                Total:
              </span>
              <span className={isDark ? "text-[#F59E0B]" : "text-[#275081]"}>
                {formatCurrency(cartTotal)}
              </span>
            </div>
            {amountPaid > 0 && (
              <div
                className={`flex justify-between text-sm pt-2 border-t ${
                  isDark ? "border-[#334155]" : "border-gray-200"
                }`}
              >
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Vuelto:
                </span>
                <span
                  className={`font-bold ${
                    change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(Math.max(0, change))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selector de cliente */}
        <LabelSelect
          label="Cliente"
          name="customerId"
          control={control}
          options={clientOptions}
          icon={User}
          placeholder={
            isLoadingClients ? "Cargando..." : "Selecciona un cliente"
          }
          required
          error={errors.customerId?.message}
          disabled={isLoadingClients}
        />

        {/* Selector de método de pago */}
        <LabelSelect
          label="Método de Pago"
          name="paymentMethod"
          control={control}
          options={paymentMethodOptions}
          icon={CreditCard}
          placeholder="Selecciona método de pago"
          required
          error={errors.paymentMethod?.message}
        />

        {/* Monto pagado */}
        <div className="space-y-2">
          <label
            className={`block text-sm font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Monto Pagado (Bs.)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <Coins
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              } z-10`}
            />
            <Controller
              name="amountPaid"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                    isDark
                      ? "bg-[#1E293B] border-[#334155] text-white placeholder-gray-500 focus:border-[#F59E0B]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#275081]"
                  } focus:ring-4 ${
                    isDark
                      ? "focus:ring-[#F59E0B]/20"
                      : "focus:ring-[#275081]/20"
                  } outline-none transition-all duration-200`}
                />
              )}
            />
          </div>
          {errors.amountPaid && (
            <p className="text-red-500 text-xs font-medium">
              {errors.amountPaid.message}
            </p>
          )}
        </div>

        {/* QR */}
        {/* //*Revisar aqui */}

        {selectedPaymentMethod === "QR" && (
          <div
            className={`p-4 rounded-xl border-2 mb-4 ${isDark ? "bg-[#0F172A] border-[#F59E0B]/30" : "bg-blue-50 border-[#275081]/20"}`}
          >
            {!qrUrl ? (
              <button
                type="button"
                onClick={onGenerateQR}
                disabled={isQrLoading || cartItemsCount === 0}
                className="w-full py-2 bg-[#F59E0B] text-white rounded-lg font-bold hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2"
              >
                {isQrLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ShoppingCart size={18} />
                )}
                Generar QR de Cobro
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={qrUrl}
                  alt="QR de Pago"
                  className="w-48 h-48 bg-white p-2 rounded-lg"
                />
                {isPaid ? (
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    Pago Confirmado ✅
                  </span>
                ) : (
                  <span className="text-sm animate-pulse text-amber-600">
                    Esperando pago...
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notas (opcional) */}
        <LabelTextarea
          label="Notas (Opcional)"
          name="notes"
          control={control}
          icon={StickyNote}
          placeholder="Observaciones de la venta..."
          rows={2}
          error={errors.notes?.message}
        />

        {/* Botón de confirmar venta */}
        <button
          type="submit"
          disabled={
            isPending ||
            !isValid ||
            !isPaymentSufficient ||
            cartItemsCount === 0 ||
            !hasCashRegister ||
            (selectedPaymentMethod === "QR" && !isPaid)
          }
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isPending ||
            !isValid ||
            !isPaymentSufficient ||
            cartItemsCount === 0 ||
            !hasCashRegister
              ? "bg-gray-400 cursor-not-allowed"
              : isDark
                ? "bg-gradient-to-r from-[#1E3A8A] via-[#0F172A] to-[#F59E0B] hover:shadow-2xl hover:shadow-[#F59E0B]/50"
                : "bg-gradient-to-r from-[#275081] via-blue-600 to-[#F9E44E] hover:shadow-2xl hover:shadow-[#275081]/50"
          } text-white shadow-xl`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : !hasCashRegister ? (
            <>
              <AlertTriangle className="w-5 h-5" />
              Caja Cerrada
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Confirmar Venta
            </>
          )}
        </button>
      </form>
    );
  },
);
