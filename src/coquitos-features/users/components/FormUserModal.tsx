// * Library
import { useForm } from "react-hook-form";
import { X, User, Mail, Phone, Lock, Shield, UserCheck } from "lucide-react";

// * Others
import { LabelInputString, LabelPasswordInput, LabelSelect } from "@/shared/components";
import { useUserStore } from "../store/user.store";
// import { Role, Status } from "../interfaces";

export const FormUserModal = () => {
  // * Zustand
  const closeModal = useUserStore((state) => state.closeModal);
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-4xl mx-auto max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 sm:p-6 border-b border-gray-200/50 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Agregar Usuario</h2>
          </div>
          <button
            onClick={() => closeModal()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200/50">
            <button
              type="button"
              onClick={() => closeModal()}
              className="flex-1 px-4 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
