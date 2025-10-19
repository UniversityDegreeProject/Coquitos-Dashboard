// * Library
import { useForm, type SubmitHandler } from "react-hook-form";
import { X, Package, FileText, DollarSign, Hash, Box, AlertTriangle, Layers, Tag, CheckCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

// * Others
import { LabelInputString, LabelSelect, LabelTextarea, LabelInputNumber } from "@/shared/components";
import { useProductStore } from "../store/product.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { statusOptions } from "../const";
import { createProductSchema, type CreateProductSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useShallow } from "zustand/shallow";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useGetCategories } from "@/coquitos-features/categories/hooks/useGetCategories";

const onlyStatusOptions = statusOptions.filter((option) => option.value !== "");

const initialValues: CreateProductSchema = {
  name: "",
  description: "",
  price: 0,
  sku: "",
  stock: 0,
  minStock: 5,
  image: "",
  ingredients: "",
  categoryId: "",
  status: "Disponible",
};

/**
 * Modal de formulario para crear/editar productos
 * Implementa validación con React Hook Form y Zod
 */
export const FormProductModal = () => {
  // * Zustand
  const closeModal = useProductStore(useShallow((state) => state.closeModal));
  const modalMode = useProductStore(useShallow((state) => state.modalMode));
  const productToUpdate = useProductStore(useShallow((state) => state.productToUpdate));
  
  // * Theme
  const { isDark } = useTheme();

  // * TanstackQuery
  const { useCreateProductMutation, isPending: isCreatingProduct } = useCreateProduct();
  const { updateProductMutation, isPending: isUpdatingProduct } = useUpdateProduct();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategories();
  
  // * Determinar si es modo editar
  const isEditMode = modalMode === 'update';
  
  // * React Hook Form
  const { control, setValue, handleSubmit, formState: { errors, isValid } } = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<CreateProductSchema> = (data) => {
    closeModal();
    
    if (isEditMode && productToUpdate?.id) {
      updateProductMutation.mutate({
        productId: productToUpdate.id,
        productData: data
      });
      return; 
    }

    useCreateProductMutation.mutate(data);
  };

  // Effect para actualizar el modal en modo edición
  useEffect(() => {
    if (modalMode === 'update' && productToUpdate) {
      setValue('name', productToUpdate.name || '');
      setValue('description', productToUpdate.description || '');
      setValue('price', productToUpdate.price || 0);
      setValue('sku', productToUpdate.sku || '');
      setValue('stock', productToUpdate.stock || 0);
      setValue('minStock', productToUpdate.minStock || 5);
      setValue('image', productToUpdate.image || '');
      setValue('ingredients', productToUpdate.ingredients || '');
      setValue('categoryId', productToUpdate.categoryId || '');
      setValue('status', productToUpdate.status || 'Disponible');
    }
  }, [modalMode, setValue, productToUpdate]);

  // Preparar opciones de categorías para el select
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id || ''
  }));

  const isPending = isCreatingProduct || isUpdatingProduct;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-[#1E293B]/95' : 'bg-white/95'} backdrop-blur-md rounded-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border ${isDark ? 'border-[#334155]/20' : 'border-white/20'}`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-md p-4 border-b ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'} flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
              <Package className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
            </div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              {isEditMode ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
          </div>
          <button
            onClick={() => closeModal()}
            className={`p-2 ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200 cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Primera fila - Nombre */}
          <div className="grid grid-cols-1 gap-3">
            <LabelInputString 
              label="Nombre del Producto" 
              name="name" 
              control={control}
              icon={Package}
              required
              placeholder="Ej: Chorizo Clásico 1/2 kg"
              error={errors.name?.message}
            />
          </div>

          {/* Segunda fila - Precio, SKU, Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LabelInputNumber
              label="Precio (Bs.)"
              name="price"
              control={control}
              icon={DollarSign}
              required
              placeholder="0.00"
              error={errors.price?.message}
            />

            <LabelInputString
              label="SKU"
              name="sku"
              control={control}
              icon={Hash}
              placeholder="CHO-CLA-500"
              error={errors.sku?.message}
            />

            <LabelSelect
              label="Categoría"
              name="categoryId"
              control={control}
              options={categoryOptions}
              icon={Layers}
              placeholder={isLoadingCategories ? "Cargando..." : "Selecciona una categoría"}
              required
              error={errors.categoryId?.message}
              disabled={isLoadingCategories}
            />
          </div>

          {/* Tercera fila - Stock y Stock Mínimo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LabelInputNumber
              label="Stock Actual"
              name="stock"
              control={control}
              icon={Box}
              placeholder="0"
              error={errors.stock?.message}
            />

            <LabelInputNumber
              label="Stock Mínimo"
              name="minStock"
              control={control}
              icon={AlertTriangle}
              placeholder="5"
              error={errors.minStock?.message}
            />

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

          {/* Cuarta fila - Descripción */}
          <div className="grid grid-cols-1 gap-3">
            <LabelTextarea
              label="Descripción"
              name="description"
              control={control}
              icon={FileText}
              placeholder="Presentación, envase, conservación..."
              rows={3}
              error={errors.description?.message}
            />
          </div>

          {/* Quinta fila - Ingredientes */}
          <div className="grid grid-cols-1 gap-3">
            <LabelTextarea
              label="Ingredientes"
              name="ingredients"
              control={control}
              icon={Tag}
              placeholder="Carne de pollo, tocino de cerdo, almidón, sal y especias..."
              rows={3}
              error={errors.ingredients?.message}
            />
          </div>

          {/* Sexta fila - Imagen URL */}
          <div className="grid grid-cols-1 gap-3">
            <LabelInputString
              label="URL de Imagen"
              name="image"
              control={control}
              icon={Package}
              placeholder="https://ejemplo.com/imagen.jpg"
              error={errors.image?.message}
            />
          </div>

          {/* Botones */}
          <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'}`}>
            <button
              type="button"
              onClick={() => closeModal()}
              className={`flex-1 px-4 py-2.5 border ${isDark ? 'border-[#334155] text-[#E2E8F0] hover:bg-[#334155]/50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-all duration-200 font-medium text-sm cursor-pointer`}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isPending || !isValid}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${isDark ? 'from-[#1E3A8A] to-[#F59E0B] hover:from-[#1E3A8A]/90 hover:to-[#F59E0B]/90' : 'from-[#275081] to-[#F9E44E] hover:from-[#275081]/90 hover:to-[#F9E44E]/90'} text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2`}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending 
                ? (isEditMode ? 'Actualizando...' : 'Creando...') 
                : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

