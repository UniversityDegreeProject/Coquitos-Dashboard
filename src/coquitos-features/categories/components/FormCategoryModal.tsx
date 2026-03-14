// * Library
import { useForm, type SubmitHandler } from "react-hook-form";
import { X, Layers, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

// * Others
import {
  LabelInputString,
  LabelSelect,
  LabelTextarea,
} from "@/shared/components";
import { useCategoryStore } from "../store/category.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { statusOptions } from "../const";
import { createCategorySchema, type CategorySchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useShallow } from "zustand/shallow";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import type { SearchCategoriesParams } from "../interfaces";

const onlyStatusOptions = statusOptions.filter((option) => option.value !== "");

const initialValues: CategorySchema = {
  id: undefined,
  name: "",
  description: "",
  status: "Activo",
};

interface FormCategoryModalProps {
  currentParams: SearchCategoriesParams;
}

/**
 * Modal de formulario para crear/editar categorías
 * Implementa validación con React Hook Form y Zod
 */
export const FormCategoryModal = (props: FormCategoryModalProps) => {
  const { currentParams } = props;
  // * Zustand
  const closeModal = useCategoryStore(useShallow((state) => state.closeModal));
  const modalMode = useCategoryStore(useShallow((state) => state.modalMode));
  const categoryToUpdate = useCategoryStore(
    useShallow((state) => state.categoryToUpdate),
  );
  const setIsMutation = useCategoryStore(
    useShallow((state) => state.setIsMutation),
  );
  // * Theme
  const { isDark } = useTheme();

  // * TanstackQuery
  const { useCreateCategoryMutation, isPending: isCreatingCategory } =
    useCreateCategory({
      currentParams,
      onSuccessCallback: closeModal,
      onFinally: () => setIsMutation(false),
    });
  const { updateCategoryMutation, isPending: isUpdatingCategory } =
    useUpdateCategory({
      currentParams,
      onSuccessCallback: closeModal,
      onFinally: () => setIsMutation(false),
      categoryMessageState: "",
    });

  // * Determinar si es modo editar
  const isEditMode = modalMode === "update";

  // * React Hook Form
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const handleSubmitForm: SubmitHandler<CategorySchema> = (data) => {
    closeModal();
    setIsMutation(true);
    if (isEditMode) {
      updateCategoryMutation.mutate(data);
      return;
    }

    useCreateCategoryMutation.mutate(data);
  };

  // Effect para actualizar el modal en modo edición
  useEffect(() => {
    if (modalMode === "update") {
      setValue("id", categoryToUpdate?.id || crypto.randomUUID());
      setValue("name", categoryToUpdate?.name || "");
      setValue("description", categoryToUpdate?.description || "");
      setValue("status", categoryToUpdate?.status || "Activo");
    }
  }, [modalMode, setValue, categoryToUpdate]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div
        className={`${isDark ? "bg-[#1E293B]" : "bg-white"} rounded-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border ${isDark ? "border-[#334155]/20" : "border-white/20"}`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 ${isDark ? "bg-[#1E293B]" : "bg-white"} p-4 border-b ${isDark ? "border-[#334155]/50" : "border-gray-200/50"} flex items-center justify-between rounded-t-2xl`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${isDark ? "bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20" : "bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20"}`}
            >
              <Layers
                className={`w-5 h-5 ${isDark ? "text-[#F59E0B]" : "text-[#275081]"}`}
              />
            </div>
            <h2
              className={`text-lg font-bold ${isDark ? "text-[#F8FAFC]" : "text-[#1F2937]"}`}
            >
              {isEditMode ? "Editar Categoría" : "Agregar Categoría"}
            </h2>
          </div>
          <button
            onClick={() => closeModal()}
            className={`p-2 ${isDark ? "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"} rounded-lg transition-all duration-200 cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="p-4 space-y-4"
        >
          {/* Primera fila - Nombre de la categoría */}
          <div className="grid grid-cols-1 gap-3">
            <LabelInputString
              label="Nombre de la Categoría"
              name="name"
              control={control}
              icon={Layers}
              required
              placeholder="Ej: Combos, Bebidas, Postres..."
              error={errors.name?.message}
            />
          </div>

          {/* Segunda fila - Descripción */}
          <div className="grid grid-cols-1 gap-3">
            <LabelTextarea
              label="Descripción"
              name="description"
              control={control}
              icon={FileText}
              required
              placeholder="Describe brevemente esta categoría..."
              rows={4}
              error={errors.description?.message}
            />
          </div>

          {/* Tercera fila - Estado */}
          <div className="grid grid-cols-1 gap-3">
            <LabelSelect
              label="Estado"
              name="status"
              control={control}
              options={onlyStatusOptions}
              icon={CheckCircle}
              placeholder="Selecciona un estado"
              required
              error={errors.status?.message}
            />
          </div>

          {/* Botones */}
          <div
            className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDark ? "border-[#334155]/50" : "border-gray-200/50"}`}
          >
            <button
              type="button"
              onClick={() => closeModal()}
              className={`flex-1 px-4 py-2.5 border ${isDark ? "border-[#334155] text-[#E2E8F0] hover:bg-[#334155]/50" : "border-gray-300 text-gray-700 hover:bg-gray-50"} rounded-lg transition-all duration-200 font-medium text-sm cursor-pointer`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreatingCategory || isUpdatingCategory}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${isDark ? "from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90" : "from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90"} text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2`}
            >
              {isCreatingCategory ||
                (isUpdatingCategory && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ))}
              {isCreatingCategory || isUpdatingCategory
                ? "Actualizando..."
                : isEditMode
                  ? "Actualizar Categoría"
                  : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
