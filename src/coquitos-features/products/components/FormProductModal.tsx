// * Library
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { X, Package, FileText, Coins, Hash, Box, AlertTriangle, Layers, Tag, CheckCircle, Loader2, Image as ImageIcon, Weight, Plus, Clock } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

// * Others
import { LabelInputString, LabelSelect, LabelTextarea } from "@/shared/components";
import { useProductStore } from "../store/product.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { statusOptions } from "../const";
import {  productSchema, type ProductSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useGetCategories } from "@/coquitos-features/categories/hooks/useGetCategories";
import { compressImage, validateImageSize, getImageInfo, generateSKUWithCategory } from "../helpers";
import { toast } from "sonner";
import type { ProductStatus, SearchProductsParams, PendingBatch } from "../interfaces";
import { useGetBatches, useDeleteBatch, useUpdateBatchStock, useCreateProduct } from "../hooks";
import { BatchList, BatchListLocal, FormBatchModal } from "./";
import { productsQueries } from "../const";
import { createBatch } from "../services/product-batch.service";
import Swal from "sweetalert2";

const onlyStatusOptions = statusOptions;

const initialValues: ProductSchema = {
  id: undefined,
  name: "",
  description: "",
  price: "",
  sku: "",
  stock: "",
  minStock: "",
  image: "",
  ingredients: "",
  categoryId: "",
  status: "Disponible",
  isVariableWeight: false,
  pricePerKg: "",
  expirationDate: "",
};


interface FormProductModalProps {
  currentParams: SearchProductsParams;
  onNewPageCreated: (newPage: number) => void;
}
/**
 * Modal de formulario para crear/editar productos
 * Implementa validación con React Hook Form y Zod
 */
export const FormProductModal = ({ currentParams, onNewPageCreated }: FormProductModalProps) => {

  // * Estado local para batches pendientes (solo en modo creación)
  const [pendingBatches, setPendingBatches] = useState<PendingBatch[]>([]);
  // * Estado local para modal de batch
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  
  // * Zustand
  const closeModal = useProductStore(useShallow((state) => state.closeModal));
  const modalMode = useProductStore(useShallow((state) => state.modalMode));
  const productToUpdate = useProductStore(useShallow((state) => state.productToUpdate));
  // * Theme
  const { isDark } = useTheme();
  
  // * TanStack Query Client para refetch manual
  const queryClient = useQueryClient();

  // * Estado local para preview de imagen
  const [imagePreview, setImagePreview] = useState<string>("");

  // * TanstackQuery
  const { useCreateProductMutation , isPending: isCreatingProduct } = useCreateProduct({
    currentParams,
    onNewPageCreated,
  });
  const { updateProductMutation, isPending: isUpdatingProduct } = useUpdateProduct({
    currentParams,
  });
  // Solo obtener categorías activas para el formulario
  const { categories, isLoading: isLoadingCategories } = useGetCategories({
    search : "",
    status : "Activo",
    page : 1,
    limit : 10000,
  });
  
  // * Determinar si es modo editar
  const isEditMode = modalMode === 'update';
  
  // * React Hook Form
  const { control, setValue, handleSubmit, watch, formState: { errors, isValid } } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Observar nombre, categoría y isVariableWeight
  const watchedName = watch("name");
  const watchedCategoryId = watch("categoryId");
  const watchedIsVariableWeight = watch("isVariableWeight");
  
  // * Obtener batches solo si es modo edición y producto de peso variable
  const { batches, isLoading: isLoadingBatches } = useGetBatches(
    productToUpdate?.id || "", 
    isEditMode && !!productToUpdate?.id && watchedIsVariableWeight
  );
  
  // * Hooks para gestión de batches
  const { deleteBatchMutation } = useDeleteBatch({ productId: productToUpdate?.id || "" });
  const { updateBatchStockMutation } = useUpdateBatchStock({ 
    productId: productToUpdate?.id || "",
    onSuccessCallback: () => {},
  });
  
  // * Handlers para batches (modo edición)
  const handleDeleteBatch = useCallback((batchId: string) => {
    deleteBatchMutation.mutate(batchId);
  }, [deleteBatchMutation]);
  
  const handleUpdateBatchStock = useCallback((
    batchId: string, 
    newStock: number, 
    userId: string,
    reason?: string,
    notes?: string
  ) => {
    updateBatchStockMutation.mutate({ 
      batchId, 
      stock: newStock,
      userId,
      reason,
      notes
    });
  }, [updateBatchStockMutation]);

  // * Handlers para batches pendientes (modo creación)
  const handleAddPendingBatch = useCallback((batch: PendingBatch) => {
    setPendingBatches((prev) => [...prev, batch]);
  }, []);

  const handleDeletePendingBatch = useCallback((tempId: string) => {
    setPendingBatches((prev) => prev.filter((b) => b.tempId !== tempId));
  }, []);

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // Convertir strings a números para el backend
    const productData: any = {
      ...data,
      price: data.isVariableWeight ? 0 : parseFloat(data.price || '0'),
      stock: data.isVariableWeight ? 0 : (data.stock ? parseInt(data.stock) : 0),
      minStock: data.minStock ? parseInt(data.minStock) : 5,
      status : data.status as ProductStatus,
      isVariableWeight: data.isVariableWeight || false,
      pricePerKg: data.pricePerKg ? parseFloat(data.pricePerKg) : undefined,
    };
    
    // Eliminar expirationDate del objeto si está vacío o es producto variable
    // Los productos variables no tienen fecha a nivel de producto (la tienen en batches)
    if (data.isVariableWeight || !data.expirationDate || data.expirationDate.trim() === '') {
      delete productData.expirationDate;
    } else {
      // Solo incluir expirationDate si tiene valor y NO es producto variable
      productData.expirationDate = new Date(data.expirationDate).toISOString();
    }
    
    if (isEditMode && productToUpdate?.id) {
      // Modo edición: comportamiento normal
      closeModal();
      updateProductMutation.mutate(productData);
      return; 
    }

    // Modo creación: crear producto primero, luego batches pendientes
    const batchesCount = pendingBatches.length; // Guardar antes de limpiar
    try {
      // Crear producto
      const createdProduct = await useCreateProductMutation.mutateAsync(productData);
      
      // Si hay batches pendientes, crearlos después de crear el producto
      if (batchesCount > 0 && createdProduct.product.id) {
        const batchCreationPromises = pendingBatches.map(async (pendingBatch) => {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const batchData: any  = {
            productId: createdProduct.product.id,
            weight: pendingBatch.weight,
            unitPrice: pendingBatch.unitPrice,
          };
          
          if (pendingBatch.expirationDate) {
            batchData.expirationDate = new Date(pendingBatch.expirationDate).toISOString();
          }
          
          return createBatch(createdProduct.product.id as string, batchData);
        });

        // Crear todos los batches en paralelo
        await Promise.all(batchCreationPromises);
      }

      // Cerrar modal y limpiar batches pendientes
      setPendingBatches([]);
      closeModal();
      
      // Invalidar queries para refrescar la UI
      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });
      
     
    } catch (error) {
      // Si falla la creación de batches pero el producto ya se creó, mostrar advertencia
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      await Swal.fire({
        title: batchesCount > 0 ? 'Producto creado, pero algunos batches fallaron' : 'Error al crear producto',
        text: errorMessage,
        icon: batchesCount > 0 ? 'warning' : 'error',
        timer: 3000,
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
      
      // Limpiar batches pendientes de todas formas
      setPendingBatches([]);
      closeModal();
      
      // Invalidar queries para refrescar la UI
      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });
    }
  };

  // Effect para actualizar el modal en modo edición
  useEffect(() => {
    if (modalMode === 'update' && productToUpdate) {
      setValue('id', productToUpdate.id || '');
      setValue('name', productToUpdate.name || '');
      setValue('description', productToUpdate.description || '');
      setValue('price', productToUpdate.price?.toString() || '');
      setValue('sku', productToUpdate.sku || '');
      setValue('stock', productToUpdate.stock?.toString() || '');
      setValue('minStock', productToUpdate.minStock?.toString() || '');
      setValue('image', productToUpdate.image || '');
      setValue('ingredients', productToUpdate.ingredients || '');
      setValue('categoryId', productToUpdate.categoryId || '');
      setValue('status', productToUpdate.status as ProductStatus);
      setValue('isVariableWeight', productToUpdate.isVariableWeight || false);
      setValue('pricePerKg', productToUpdate.pricePerKg?.toString() || '');
      // Formatear fecha de vencimiento para input type="date" (YYYY-MM-DD)
      // Usar solo los componentes de fecha sin considerar zona horaria para evitar cambios de día
      if (productToUpdate.expirationDate) {
        const expirationDateStr = typeof productToUpdate.expirationDate === 'string' 
          ? productToUpdate.expirationDate 
          : productToUpdate.expirationDate.toISOString();
        
        // Extraer año, mes y día directamente del string ISO (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)
        const dateMatch = expirationDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          const [, year, month, day] = dateMatch;
          setValue('expirationDate', `${year}-${month}-${day}`);
        } else {
          // Fallback: usar Date si el formato no es ISO
          const expirationDate = typeof productToUpdate.expirationDate === 'string' 
            ? new Date(productToUpdate.expirationDate) 
            : productToUpdate.expirationDate;
          if (!isNaN(expirationDate.getTime())) {
            const year = expirationDate.getFullYear();
            const month = String(expirationDate.getMonth() + 1).padStart(2, '0');
            const day = String(expirationDate.getDate()).padStart(2, '0');
            setValue('expirationDate', `${year}-${month}-${day}`);
          }
        }
      } else {
        setValue('expirationDate', '');
      }
      setImagePreview(productToUpdate.image || '');
    } else if (modalMode === 'create') {
      setImagePreview('');
    }
  }, [modalMode, setValue, productToUpdate]);

  // Effect para generar SKU automáticamente en modo creación
  useEffect(() => {
    // Solo generar SKU automático en modo creación
    if (modalMode === 'create' && watchedName && watchedCategoryId) {
      const selectedCategory = categories?.find(cat => cat.id === watchedCategoryId);
      
      if (selectedCategory) {
        // Generar SKU con categoría y nombre
        const autoSKU = generateSKUWithCategory(watchedName, selectedCategory.name);
        setValue('sku', autoSKU, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } 
    }
  }, [watchedName, watchedCategoryId, modalMode, categories, setValue]);

  // Effect para manejar cambio de tipo de producto (peso variable)
  useEffect(() => {
    if (watchedIsVariableWeight) {
      // Si es peso variable, establecer stock y price en 0 (el schema ignora estos valores)
      setValue('stock', '0', { shouldValidate: false });
      setValue('price', '0', { shouldValidate: false });
    }
  }, [watchedIsVariableWeight, setValue]);

  // Effect para limpiar batches pendientes cuando cambia el modo o se cierra el modal
  useEffect(() => {
    if (modalMode === 'create') {
      // Limpiar batches pendientes al cambiar a modo creación
      setPendingBatches([]);
    }
  }, [modalMode]);

  // Handler para cambio de imagen con compresión automática
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    try {
      // Obtener información del archivo
      const imageInfo = getImageInfo(file);
      

      // Validar tamaño máximo (5 MB)
      if (!validateImageSize(file, 5)) {
        toast.error('Imagen demasiado grande', {
          description: `El tamaño máximo permitido es 5 MB. Tu imagen pesa ${imageInfo.sizeInMB} MB.`,
        });
        e.target.value = ''; // Limpiar input
        return;
      }

      // Mostrar loading toast
      const toastId = toast.loading('Comprimiendo imagen...');

      // Comprimir imagen
      const compressedBase64 = await compressImage(file);
      
      // Actualizar preview y formulario
      setImagePreview(compressedBase64);
      setValue('image', compressedBase64, { 
        shouldValidate: true, 
        shouldDirty: true, 
        shouldTouch: true 
      });

      // Mostrar éxito
      toast.success('Imagen procesada correctamente', {
        id: toastId,
        description: 'La imagen ha sido optimizada y está lista para usar.',
      });

    } catch (error) {
      toast.error('Error al procesar imagen', {
        description: error instanceof Error ? error.message : 'No se pudo procesar la imagen',
      });
      e.target.value = ''; // Limpiar input
    }
  };

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
            onClick={async () => {
              // Refrescar productos antes de cerrar (para actualizar tarjeta con cambios de batches)
              await queryClient.refetchQueries({ queryKey: productsQueries.allProducts });
              closeModal();
            }}
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

          {/* Checkbox - Producto de Peso Variable */}
          <div className="grid grid-cols-1 gap-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDark ? 'bg-[#0F172A]/50 border-[#334155]' : 'bg-gray-50 border-gray-200'}`}>
              <Controller
                name="isVariableWeight"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isVariableWeight"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                    <label
                      htmlFor="isVariableWeight"
                      className={`text-sm font-medium cursor-pointer ${isDark ? 'text-[#F8FAFC]' : 'text-gray-700'}`}
                    >
                      Producto de Peso Variable
                    </label>
                  </div>
                )}
              />
              <Weight className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
              <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                {watchedIsVariableWeight 
                  ? "Se gestionará mediante lotes de compra con peso/precio individual" 
                  : "Producto con precio fijo"}
              </p>
            </div>
          </div>

          {/* Segunda fila - Precio o Precio por Kg, SKU, Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {!watchedIsVariableWeight ? (
              <LabelInputString
                label="Precio (Bs.)"
                name="price"
                control={control}
                icon={Coins}
                required
                placeholder="18.50"
                error={errors.price?.message}
                type="text"
                inputMode="decimal"
              />
            ) : (
              <LabelInputString
                label="Precio por Kg (Bs.)"
                name="pricePerKg"
                control={control}
                icon={Weight}
                required
                placeholder="50.00"
                error={errors.pricePerKg?.message}
                type="text"
                inputMode="decimal"
              />
            )}

            <LabelInputString
              label="Código del Producto"
              name="sku"
              control={control}
              icon={Hash}
              required
              placeholder="CHO-CLA-500"
              error={errors.sku?.message}
              disabled = {true}
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
            <LabelInputString
              label="Unidades en stock"
              name="stock"
              control={control}
              icon={Box}
              required={!watchedIsVariableWeight}
              placeholder="10"
              error={errors.stock?.message}
              type="text"
              inputMode="numeric"
              disabled={watchedIsVariableWeight}
            />

            <LabelInputString
              label="Unidades mínimas para alerta de stock"
              name="minStock"
              control={control}
              icon={AlertTriangle}
              required
              placeholder="5"
              error={errors.minStock?.message}
              type="text"
              inputMode="numeric"
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

          {/* Fila - Fecha de Vencimiento (solo para productos sin batches) */}
          {!watchedIsVariableWeight && (
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                  Fecha de Vencimiento (Opcional)
                </label>
                <div className="relative">
                  <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} z-10`} />
                  <Controller
                    name="expirationDate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-500 focus:border-[#F59E0B]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#275081]'} focus:ring-4 ${isDark ? 'focus:ring-[#F59E0B]/20' : 'focus:ring-[#275081]/20'} outline-none transition-all duration-200`}
                      />
                    )}
                  />
                </div>
                {errors.expirationDate && (
                  <p className="text-red-500 text-xs font-medium">{errors.expirationDate.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Sexta fila - Subir Imagen */}
          <div className="grid grid-cols-1 gap-3">
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              Imagen del Producto
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.image && (
              <p className="text-red-600 text-xs font-medium" role="alert">
                {errors.image.message}
              </p>
            )}
            <div className="flex gap-4 items-start">
              {/* Input File (pequeño) */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 ${
                      isDark 
                        ? 'border-[#334155] bg-[#1E293B] hover:bg-[#334155]/50 text-[#F8FAFC]' 
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    } cursor-pointer transition-all duration-200`}
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Subir Imagen</span>
                  </label>
                </div>
              </div>

              {/* Preview de la imagen (grande) */}
              <div className="flex-1">
                <div className={`relative w-full h-48 rounded-xl border-2 ${
                  isDark ? 'border-[#334155]' : 'border-gray-200'
                } overflow-hidden flex items-center justify-center`}
                style={{
                  backgroundImage: isDark 
                    ? 'linear-gradient(45deg, #1E293B 25%, #0F172A 25%, #0F172A 50%, #1E293B 50%, #1E293B 75%, #0F172A 75%, #0F172A)'
                    : 'linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%, #e5e7eb)',
                  backgroundSize: '20px 20px'
                }}>
                  {imagePreview ? (
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-4 z-10 relative">
                      <div className={`${isDark ? 'bg-[#1E293B]/80' : 'bg-white/80'} backdrop-blur-sm rounded-xl p-4`}>
                        <ImageIcon className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`} />
                        <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                          Sin imagen seleccionada
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Lotes (modo edición: batches del backend | modo creación: batches pendientes) */}
          {watchedIsVariableWeight && (
            <div className={`border-t ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'} pt-4 mt-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-base font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
                  Gestión de Lotes
                </h3>
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Lote
                </button>
              </div>
              
              {isEditMode && productToUpdate?.id ? (
                // Modo edición: mostrar batches del backend
                isLoadingBatches ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className={`w-6 h-6 animate-spin ${isDark ? 'text-[#94A3B8]' : 'text-gray-500'}`} />
                  </div>
                ) : (
                  <BatchList
                    batches={batches}
                    productId={productToUpdate?.id || ""}
                    onDeleteBatch={handleDeleteBatch}
                    onUpdateStock={handleUpdateBatchStock}
                  />
                )
              ) : (
                // Modo creación: mostrar batches pendientes
                <BatchListLocal
                  batches={pendingBatches}
                  onDeleteBatch={handleDeletePendingBatch}
                />
              )}
            </div>
          )}

          {/* Botones */}
          <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDark ? 'border-[#334155]/50' : 'border-gray-200/50'}`}>
            <button
              type="button"
              onClick={async () => {
                // Refrescar productos antes de cerrar
                await queryClient.refetchQueries({ queryKey: productsQueries.allProducts });
                closeModal();
              }}
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

      {/* Modal de Batch */}
      {isBatchModalOpen && (
        <FormBatchModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          product={
            isEditMode && productToUpdate
              ? productToUpdate
              : {
                  // Producto temporal para modo creación
                  id: "",
                  name: watchedName || "Nuevo Producto",
                  description: "",
                  price: 0,
                  sku: "",
                  stock: 0,
                  minStock: 5,
                  image: "",
                  ingredients: "",
                  categoryId: watchedCategoryId || "",
                  status: "Disponible",
                  isVariableWeight: true,
                  pricePerKg: watchedIsVariableWeight && watch("pricePerKg") 
                    ? parseFloat(watch("pricePerKg") || "0") 
                    : undefined,
                }
          }
          mode={isEditMode ? 'edit' : 'create'}
          onAddPendingBatch={isEditMode ? undefined : handleAddPendingBatch}
        />
      )}
    </div>
  );
};

