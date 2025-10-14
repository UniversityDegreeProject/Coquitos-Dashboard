// * Library
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

// * Others
import { LabelInputString, LabelPasswordInput } from "@/shared/components";
import { useUserStore } from "../store/user.store";

export const FormUserModal = () => {
  // * Zustand
  const closeModal = useUserStore((state) => state.closeModal);
  // * React Hook Form
  const { control } = useForm<any>({
    // resolver: zodResolver(loginUserSchema),
  });

  return (
    <div className="fixed inset-0 bg-slate-50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Agregar Usuario</h2>
          <button
            onClick={() => closeModal()}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <LabelInputString 
          label="Usuario" 
          name="username" 
          control={control} 
        />
        

        <LabelInputString 
          label="Nombres" 
          name="firstName" 
          control={control} 
        />

        <LabelInputString 
          label="Apellidos" 
          name="lastName" 
          control={control}
        />



        <LabelInputString 
          label="Teléfono" 
          name="phone" 
          control={control}
        />

        <LabelInputString
          label="Correo Electrónico"
          name="email"
          control={control}
        />
        
        <LabelPasswordInput
          label="Contraseña"
          name="password"
          control={control}
        />
        

        <LabelInputString 
          label="Rol" 
          name="role"
          control={control} 
        />

        <div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => closeModal()}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Crear Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
