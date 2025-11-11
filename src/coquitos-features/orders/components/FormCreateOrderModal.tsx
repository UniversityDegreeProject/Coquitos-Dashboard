// * Library
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { X, ShoppingCart, Search, Package, Loader2, Coins, User, CreditCard, StickyNote, Trash2, Plus, Minus, Weight } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";

// * Others
import { useOrderStore } from "../store/order.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { createOrderSchema, type CreateOrderSchema } from "../schemas";
import { LabelSelect, LabelTextarea } from "@/shared/components";
import { paymentMethodOptions } from "../const";
import { useCreateOrder } from "../hooks";
import { useAuthStore } from "@/auth/store/auth.store";
import { useGetClients } from "@/coquitos-features/clients/hooks/useGetClients";
import { useGetProducts } from "@/coquitos-features/products/hooks/useGetProducts";
import { formatCurrency } from "../helpers";
import type { CartItem, PaymentMethod } from "../interfaces";
import type { Product } from "@/coquitos-features/products/interfaces";
import type { ProductBatch } from "@/coquitos-features/products/interfaces/product-batch.interface";
import { useGetBatches } from "@/coquitos-features/products/hooks";
import { toast } from "sonner";
import { useGetCurrentCashRegister } from "@/coquitos-features/cash-closing/hooks";
import { AlertTriangle } from "lucide-react";

const initialValues: CreateOrderSchema = {
  customerId: "",
  paymentMethod: "Efectivo",
  amountPaid: "",
  notes: "",
};

/**
 * Modal ESPECTACULAR para registro de ventas
 * Diseño dividido: Izquierda (productos con scroll) | Derecha (carrito FIJO)
 */
export const FormCreateOrderModal = () => {
  // * Zustand
  const closeCreateOrderModal = useOrderStore(useShallow((state) => state.closeCreateOrderModal));
  const cartItems = useOrderStore(useShallow((state) => state.cartItems));
  const addToCart = useOrderStore(useShallow((state) => state.addToCart));
  const removeFromCart = useOrderStore(useShallow((state) => state.removeFromCart));
  const updateCartItemQuantity = useOrderStore(useShallow((state) => state.updateCartItemQuantity));
  const clearCart = useOrderStore(useShallow((state) => state.clearCart));
  const getCartTotal = useOrderStore(useShallow((state) => state.getCartTotal));
  
  const user = useAuthStore(useShallow((state) => state.user));
  
  // * Theme
  const { isDark } = useTheme();
  
  // * Estados locales
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductForBatch, setSelectedProductForBatch] = useState<Product | null>(null);
  
  // * TanStack Query
  const { clients, isLoading: isLoadingClients } = useGetClients({
    search: "",
    type: "",
    page: 1,
    limit: 1000,
  });
  
  const { products, isLoading: isLoadingProducts } = useGetProducts({
    search: searchTerm,
    categoryId: "",
    status: "Disponible",
    lowStock: false,
    page: 1,
    limit: 100,
  });

  const { batches, isLoading: isLoadingBatches } = useGetBatches(
    selectedProductForBatch?.id || "",
    !!selectedProductForBatch?.id
  );

  // Obtener caja abierta del usuario
  const { cashRegister, isLoading: isLoadingCashRegister } = useGetCurrentCashRegister(user?.id);

  const { useCreateOrderMutation, isPending } = useCreateOrder({
    onSuccessCallback: () => {
      closeCreateOrderModal();
      clearCart();
    },
  });
  
  // * React Hook Form
  const { control, handleSubmit, watch, formState: { errors, isValid } } = useForm<CreateOrderSchema>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const watchedAmountPaid = watch("amountPaid");
  
  // * Calcular totales
  const cartTotal = getCartTotal();
  const amountPaidNumber = parseFloat(watchedAmountPaid || "0");
  const change = amountPaidNumber - cartTotal;
  
  // * Validar que el pago sea suficiente
  const isPaymentSufficient = amountPaidNumber >= cartTotal && cartTotal > 0;

  // * Handler para agregar producto al carrito
  const handleAddProductToCart = useCallback((product: Product) => {
    // Si es producto de peso variable, primero seleccionar batch
    if (product.isVariableWeight) {
      setSelectedProductForBatch(product);
      return;
    }

    // Producto de precio fijo
    const cartItem: CartItem = {
      productId: product.id!,
      productName: product.name,
      productImage: product.image,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
      isVariableWeight: false,
    };

    addToCart(cartItem);
    toast.success(`${product.name} agregado al carrito`);
  }, [addToCart]);

  // * Handler para agregar batch al carrito
  const handleAddBatchToCart = useCallback((batch: ProductBatch) => {
    if (!selectedProductForBatch) return;

    const cartItem: CartItem = {
      productId: selectedProductForBatch.id!,
      productName: selectedProductForBatch.name,
      productImage: selectedProductForBatch.image,
      quantity: 1,
      unitPrice: batch.unitPrice,
      total: batch.unitPrice,
      batchId: batch.id,
      batchCode: batch.batchCode,
      weight: batch.weight,
      isVariableWeight: true,
    };

    addToCart(cartItem);
    toast.success(`${selectedProductForBatch.name} (${batch.weight}kg) agregado al carrito`);
    setSelectedProductForBatch(null);
  }, [selectedProductForBatch, addToCart]);

  // * Submit handler
  const onSubmit: SubmitHandler<CreateOrderSchema> = (data) => {
    if (cartItems.length === 0) {
      toast.error("Debes agregar al menos un producto al carrito");
      return;
    }

    if (!isPaymentSufficient) {
      toast.error("El monto pagado es insuficiente");
      return;
    }

    if (!cashRegister || cashRegister.status !== "Abierto") {
      toast.error("No hay una caja abierta. Por favor, abre la caja primero.");
      return;
    }

    const orderData = {
      customerId: data.customerId,
      userId: user!.id,
      cashRegisterId: cashRegister.id,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        batchId: item.batchId,
      })),
      paymentMethod: data.paymentMethod,
      amountPaid: amountPaidNumber,
      notes: data.notes,
    };

    useCreateOrderMutation.mutate(orderData);
  };

  // * Preparar opciones de clientes
  const clientOptions = clients.map((client) => ({
    label: `${client.firstName} ${client.lastName}`,
    value: client.id || '',
  }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-[#0F172A]' : 'bg-white'} rounded-3xl w-full max-w-7xl h-[90vh] shadow-2xl border-2 ${isDark ? 'border-[#1E3A8A]/30' : 'border-[#275081]/20'} flex flex-col overflow-hidden`}>
        
        {/* ========== HEADER FIJO ========== */}
        <div className={`${isDark ? 'bg-gradient-to-r from-[#1E3A8A] via-[#0F172A] to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081] via-white to-[#F9E44E]/30'} p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/30' : 'bg-[#F9E44E]/30 border border-[#275081]/20'} shadow-lg`}>
                <ShoppingCart className={`w-7 h-7 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Registrar Venta
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Selecciona productos y completa la venta
                </p>
              </div>
            </div>
            <button
              onClick={closeCreateOrderModal}
              className={`p-3 ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1E293B]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} rounded-xl transition-all duration-200 cursor-pointer`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Alerta si no hay caja abierta */}
          {!isLoadingCashRegister && !cashRegister && (
            <div className="mt-4 bg-red-500/10 border-2 border-red-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-red-500 font-bold text-sm">
                    ⚠️ No hay caja abierta
                  </p>
                  <p className="text-red-400 text-xs mt-1">
                    Debes abrir la caja antes de poder registrar ventas
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========== CONTENIDO PRINCIPAL (GRID 2 COLUMNAS) ========== */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
          
          {/* ========== COLUMNA IZQUIERDA: PRODUCTOS (2/3) - CON SCROLL ========== */}
          <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
            
            {/* Buscador de productos */}
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} z-10`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-400 focus:border-[#F59E0B]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#275081]'} focus:ring-4 ${isDark ? 'focus:ring-[#F59E0B]/20' : 'focus:ring-[#275081]/20'} outline-none transition-all duration-200`}
              />
            </div>

            {/* Grid de productos con SCROLL INDEPENDIENTE */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 pr-2">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Package className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No se encontraron productos disponibles
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddProductToCart(product)}
                      type="button"
                      className={`group relative overflow-hidden rounded-xl border-2 ${isDark ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#334155] hover:border-[#F59E0B]' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-[#275081]'} p-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer`}
                    >
                      {/* Imagen */}
                      <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-[#0F172A]' : 'bg-gray-100'}`}>
                            <Package className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                          </div>
                        )}
                        
                        {/* Badge de peso variable */}
                        {product.isVariableWeight && (
                          <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <Weight className="w-3 h-3" />
                            Peso Variable
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className={`font-semibold text-sm mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>
                      <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {product.category?.name}
                      </p>
                      
                      {/* Precio */}
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
                          {product.isVariableWeight 
                            ? `${formatCurrency(product.pricePerKg || 0)}/kg` 
                            : formatCurrency(product.price)
                          }
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          Stock: {product.stock}
                        </span>
                      </div>

                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========== COLUMNA DERECHA: CARRITO (1/3) - FIJO (SIN SCROLL) ========== */}
          <div className={`lg:col-span-1 flex flex-col ${isDark ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#334155]' : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200'} rounded-2xl p-6 shadow-2xl overflow-hidden`}>
            
            {/* Header del carrito */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Carrito
                </h3>
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Items del carrito con SCROLL INDEPENDIENTE */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 pr-2 mb-4 min-h-0">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <ShoppingCart className={`w-16 h-16 ${isDark ? 'text-gray-700' : 'text-gray-300'} mb-4`} />
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    El carrito está vacío
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.productId}-${item.batchId || index}`}
                      className={`${isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-white border-gray-200'} border-2 rounded-xl p-3 transition-all duration-200 hover:shadow-lg`}
                    >
                      {/* Info del producto */}
                      <div className="flex items-start gap-3 mb-2">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-contain"
                        />
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.productName}
                          </h4>
                          {item.isVariableWeight && (
                            <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'} flex items-center gap-1`}>
                              <Weight className="w-3 h-3" />
                              {item.weight}kg - {item.batchCode}
                            </p>
                          )}
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatCurrency(item.unitPrice)} c/u
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.batchId)}
                          type="button"
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Controles de cantidad y total */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateCartItemQuantity(item.productId, item.quantity - 1, item.batchId);
                              }
                            }}
                            type="button"
                            className={`p-1 rounded-lg ${isDark ? 'bg-[#1E293B] hover:bg-[#334155]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`font-bold min-w-[40px] text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1, item.batchId)}
                            type="button"
                            className={`p-1 rounded-lg ${isDark ? 'bg-[#1E293B] hover:bg-[#334155]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className={`font-bold ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulario FIJO en la parte inferior */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-shrink-0">
              
              {/* Resumen de totales */}
              <div className={`${isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl p-4`}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t-2 ${isDark ? 'border-[#334155]' : 'border-gray-300'} pt-2">
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>Total:</span>
                    <span className={isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}>
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  {amountPaidNumber > 0 && (
                    <div className={`flex justify-between text-sm pt-2 border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Vuelto:</span>
                      <span className={`font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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
                placeholder={isLoadingClients ? "Cargando..." : "Selecciona un cliente"}
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
                <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Monto Pagado (Bs.)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Coins className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} z-10`} />
                  <Controller
                    name="amountPaid"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${isDark ? 'bg-[#1E293B] border-[#334155] text-white placeholder-gray-500 focus:border-[#F59E0B]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#275081]'} focus:ring-4 ${isDark ? 'focus:ring-[#F59E0B]/20' : 'focus:ring-[#275081]/20'} outline-none transition-all duration-200`}
                      />
                    )}
                  />
                </div>
                {errors.amountPaid && (
                  <p className="text-red-500 text-xs font-medium">{errors.amountPaid.message}</p>
                )}
              </div>

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
                disabled={isPending || !isValid || !isPaymentSufficient || cartItems.length === 0 || !cashRegister}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isPending || !isValid || !isPaymentSufficient || cartItems.length === 0 || !cashRegister
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-gradient-to-r from-[#1E3A8A] via-[#0F172A] to-[#F59E0B] hover:shadow-2xl hover:shadow-[#F59E0B]/50'
                    : 'bg-gradient-to-r from-[#275081] via-blue-600 to-[#F9E44E] hover:shadow-2xl hover:shadow-[#275081]/50'
                } text-white shadow-xl`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : !cashRegister ? (
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
          </div>
        </div>
      </div>

      {/* Modal de selección de batch (para productos variables) */}
      {selectedProductForBatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-2xl w-full max-w-2xl shadow-2xl border-2 ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
            <div className={`p-6 border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Selecciona un Lote
                </h3>
                <button
                  onClick={() => setSelectedProductForBatch(null)}
                  type="button"
                  className={`p-2 ${isDark ? 'hover:bg-[#334155]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedProductForBatch.name}
              </p>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {isLoadingBatches ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                </div>
              ) : batches.length === 0 ? (
                <div className="text-center py-12">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No hay lotes disponibles para este producto
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {batches
                    .filter((batch) => batch.stock > 0)
                    .map((batch) => (
                      <button
                        key={batch.id}
                        onClick={() => handleAddBatchToCart(batch)}
                        type="button"
                        className={`${isDark ? 'bg-[#0F172A] border-[#334155] hover:border-[#F59E0B]' : 'bg-gray-50 border-gray-200 hover:border-[#275081]'} border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-lg cursor-pointer`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {batch.batchCode}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Peso: {batch.weight}kg | Stock: {batch.stock}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`}>
                              {formatCurrency(batch.unitPrice)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

