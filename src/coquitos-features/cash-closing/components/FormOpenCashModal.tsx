import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { X, DollarSign, Loader2, Unlock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";
import { useTheme } from "@/shared/hooks/useTheme";
import { useCashRegisterStore } from "../store/cash-register.store";
import { openCashRegisterSchema, type OpenCashRegisterSchema } from "../schemas";
import { useOpenCashRegister } from "../hooks";
import { useAuthStore } from "@/auth/store/auth.store";

/**
 * Modal para abrir caja
 * Solicita monto inicial con el que se abre el turno
 */
export const FormOpenCashModal = () => {
  // * Zustand
  const closeOpenCashModal = useCashRegisterStore(useShallow((state) => state.closeOpenCashModal));
  const user = useAuthStore(useShallow((state) => state.user));
  
  // * Theme
  const { isDark } = useTheme();

  // * Hook mutation
  const { useOpenCashRegisterMutation, isPending } = useOpenCashRegister({
    onSuccessCallback: closeOpenCashModal,
  });
  
  // * React Hook Form
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<OpenCashRegisterSchema>({
    resolver: zodResolver(openCashRegisterSchema),
    defaultValues: {
      userId: user?.id || "",
      openingAmount: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<OpenCashRegisterSchema> = (data) => {
    closeOpenCashModal();
    
    useOpenCashRegisterMutation.mutate({
      userId: data.userId,
      openingAmount: parseFloat(data.openingAmount),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-3xl w-full max-w-lg shadow-2xl border-2 ${isDark ? 'border-[#1E3A8A]/30' : 'border-[#275081]/20'}`}>
        
        {/* Header */}
        <div className={`${isDark ? 'bg-gradient-to-r from-emerald-900/30 via-[#1E293B] to-emerald-900/30' : 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50'} p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'} rounded-t-3xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-100 border border-emerald-300'} shadow-lg`}>
                <Unlock className={`w-7 h-7 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Abrir Caja
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ingresa el monto inicial del turno
                </p>
              </div>
            </div>
            <button
              onClick={closeOpenCashModal}
              className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#334155]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} rounded-xl transition-all duration-200`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Monto Inicial */}
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Monto Inicial (Bs.)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} z-10`} />
              <Controller
                name="openingAmount"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    inputMode="decimal"
                    placeholder="100.00"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${isDark ? 'bg-[#0F172A] border-[#334155] text-white placeholder-gray-500 focus:border-emerald-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'} focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-lg font-semibold`}
                  />
                )}
              />
            </div>
            {errors.openingAmount && (
              <p className="text-red-500 text-xs font-medium">{errors.openingAmount.message}</p>
            )}
          </div>

          {/* Info */}
          <div className={`${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border-2 rounded-xl p-4`}>
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              💡 <strong>Consejo:</strong> Cuenta el efectivo inicial antes de abrir la caja. Este monto se usará para calcular la diferencia al cierre.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeOpenCashModal}
              className={`flex-1 px-4 py-3 border-2 ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#334155]/50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-xl transition-all duration-200 font-semibold`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !isValid}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isPending || !isValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDark
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:shadow-2xl hover:shadow-emerald-500/50'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-2xl hover:shadow-emerald-500/50'
              } text-white shadow-xl`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Abriendo...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Abrir Caja
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

