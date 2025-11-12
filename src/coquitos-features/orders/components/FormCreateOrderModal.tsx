import { useForm, type SubmitHandler } from "react-hook-form";
import { X, ShoppingCart, AlertTriangle } from "lucide-react";
import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";
import { toast } from "sonner";

// Hooks y stores
import { useOrderStore } from "../store/order.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/auth/store/auth.store";
import { useCreateOrder } from "../hooks";
import { useGetClients } from "@/coquitos-features/clients/hooks/useGetClients";
import { useGetProducts } from "@/coquitos-features/products/hooks/useGetProducts";
import { useGetBatches } from "@/coquitos-features/products/hooks";
import { useGetCurrentCashRegister } from "@/coquitos-features/cash-closing/hooks";

// Schemas y constantes
import { createOrderSchema, type CreateOrderSchema } from "../schemas";
import { paymentMethodOptions } from "../const";

// Tipos
import type { CartItem } from "../interfaces";
import type { Product } from "@/coquitos-features/products/interfaces";
import type { ProductBatch } from "@/coquitos-features/products/interfaces/product-batch.interface";

// Componentes
import { ProductSearchSection } from "./ProductSearchSection";
import { CartSection } from "./CartSection";
import { CheckoutForm } from "./CheckoutForm";
import { BatchSelectionModal } from "./BatchSelectionModal";

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
  const isPaymentSufficient = amountPaidNumber >= cartTotal && cartTotal > 0;

  // * Handler para agregar producto al carrito
  const handleAddProductToCart = useCallback((product: Product) => {
    if (product.isVariableWeight) {
      setSelectedProductForBatch(product);
      return;
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cartItems.find(
      (item) => item.productId === product.id && !item.batchId
    );

    if (existingItem) {
      // Si ya existe, verificar stock antes de agregar más
      if (existingItem.quantity >= existingItem.availableStock) {
        toast.error(`Stock insuficiente. Solo hay ${existingItem.availableStock} disponible${existingItem.availableStock === 1 ? '' : 's'}`);
        return;
      }
    }

    const cartItem: CartItem = {
      productId: product.id!,
      productName: product.name,
      productImage: product.image,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
      isVariableWeight: false,
      availableStock: product.stock,
    };

    addToCart(cartItem);
    toast.success(`${product.name} agregado al carrito`);
  }, [addToCart, cartItems]);

  // * Handler para agregar batch al carrito
  const handleAddBatchToCart = useCallback((batch: ProductBatch) => {
    if (!selectedProductForBatch) return;

    // Verificar si el batch ya está en el carrito
    const existingItem = cartItems.find(
      (item) => item.productId === selectedProductForBatch.id && item.batchId === batch.id
    );

    if (existingItem) {
      // Si ya existe, verificar stock antes de agregar más
      if (existingItem.quantity >= existingItem.availableStock) {
        toast.error(`Stock insuficiente. Solo hay ${existingItem.availableStock} disponible${existingItem.availableStock === 1 ? '' : 's'}`);
        return;
      }
    }

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
      availableStock: batch.stock,
    };

    addToCart(cartItem);
    toast.success(`${selectedProductForBatch.name} (${batch.weight}kg) agregado al carrito`);
    setSelectedProductForBatch(null);
  }, [selectedProductForBatch, addToCart, cartItems]);

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
          
          {/* COLUMNA IZQUIERDA: PRODUCTOS */}
          <ProductSearchSection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            products={products}
            isLoading={isLoadingProducts}
            onAddToCart={handleAddProductToCart}
          />

          {/* COLUMNA DERECHA: CARRITO + CHECKOUT */}
          <div className={`lg:col-span-1 flex flex-col ${isDark ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#334155]' : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200'} rounded-2xl p-6 shadow-2xl overflow-hidden`}>
            
            <CartSection
              cartItems={cartItems}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateCartItemQuantity}
            />

            <CheckoutForm
              control={control}
              errors={errors}
              isValid={isValid}
              isPending={isPending}
              cartTotal={cartTotal}
              amountPaid={amountPaidNumber}
              change={change}
              isPaymentSufficient={isPaymentSufficient}
              cartItemsCount={cartItems.length}
              hasCashRegister={!!cashRegister}
              clientOptions={clientOptions}
              isLoadingClients={isLoadingClients}
              paymentMethodOptions={paymentMethodOptions}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>

      {/* Modal de selección de batch */}
      {selectedProductForBatch && (
        <BatchSelectionModal
          product={selectedProductForBatch}
          batches={batches}
          isLoading={isLoadingBatches}
          onClose={() => setSelectedProductForBatch(null)}
          onSelectBatch={handleAddBatchToCart}
        />
      )}
    </div>
  );
};
