// * Library
import { useForm } from "react-hook-form";
import { X, User, Mail, Phone, Lock, Shield, UserCheck } from "lucide-react";

// * Others
import { LabelInputString, LabelPasswordInput, LabelSelect } from "@/shared/components";
import { useUserStore } from "../store/user.store";
import { useTheme } from "@/shared/hooks/useTheme";
// import { Role, Status } from "../interfaces";

export const FormUserModal = () => {
  // * Zustand
  const closeModal = useUserStore((state) => state.closeModal);
  // * Theme
  const { isDark } = useTheme();
  // * React Hook Form
  const { control } = useForm({
    // resolver: zodResolver(loginUserSchema),
  });

  // * Opciones para los selects
  const roleOptions = [
    { value: "Administrador", label: "Administrador" },
    { value: "Cajero", label: "Cajero" },
  ];

  const statusOptions = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
    { value: "Suspendido", label: "Suspendido" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de envío
    console.log("Formulario enviado");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-[#1E293B]/95' : 'bg-white/95'} backdrop-blur-md rounded-2xl w-full max-w-4xl mx-auto max-h-[95vh] overflow-y-auto shadow-2xl border ${isDark ? 'border-[#334155]/20' : 'border-white/20'}`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-md p-4 sm:p-6 border-b ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'} flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <User className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>Agregar Usuario</h2>
          </div>
          <button
            onClick={() => closeModal()}
            className={`p-2 ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Primera fila */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <LabelInputString 
              label="Usuario" 
              name="username" 
              control={control}
              icon={User}
              required
            />
            <LabelInputString
              label="Correo Electrónico"
              name="email"
              control={control}
              icon={Mail}
              required
            />
          </div>

          {/* Segunda fila */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <LabelInputString 
              label="Nombres" 
              name="firstName" 
              control={control}
              icon={User}
              required
            />
            <LabelInputString 
              label="Apellidos" 
              name="lastName" 
              control={control}
              icon={User}
              required
            />
          </div>

          {/* Tercera fila */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <LabelInputString 
              label="Teléfono" 
              name="phone" 
              control={control}
              icon={Phone}
              required
            />
            <LabelPasswordInput
              label="Contraseña"
              name="password"
              control={control}
              icon={Lock}
              required
            />
          </div>

          {/* Cuarta fila */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <LabelSelect
              label="Rol"
              name="role"
              control={control}
              options={roleOptions}
              icon={Shield}
              placeholder="Selecciona un rol"
              required
            />
            <LabelSelect
              label="Estado"
              name="status"
              control={control}
              options={statusOptions}
              icon={UserCheck}
              placeholder="Selecciona un estado"
              required
            />
          </div>

          {/* Botones */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'}`}>
            <button
              type="button"
              onClick={() => closeModal()}
              className={`flex-1 px-4 sm:px-6 py-3 border-2 ${isDark ? 'border-[#334155] text-[#E2E8F0] hover:bg-[#334155]/50 hover:border-[#475569]' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} rounded-xl transition-all duration-200 font-medium text-sm sm:text-base`}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className={`flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r ${isDark ? 'from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90' : 'from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90'} text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base`}
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
