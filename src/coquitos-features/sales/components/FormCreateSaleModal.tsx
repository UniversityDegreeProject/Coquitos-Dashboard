import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { X, ShoppingCart, AlertTriangle } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/shallow";
import { toast } from "sonner";

// Hooks y stores
import { useSaleStore } from "../store/sale.store";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/auth/store/auth.store";
import { useCreateSale, usePaymentQR } from "../hooks";
import { useGetClients } from "@/coquitos-features/clients/hooks/useGetClients";
import { useGetProducts } from "@/coquitos-features/products/hooks/useGetProducts";
import { useGetBatches } from "@/coquitos-features/products/hooks";
import { useGetCurrentCashRegister } from "@/coquitos-features/cash-closing/hooks";
import { isProductExpiredOrExpiringToday } from "@/coquitos-features/products/helpers";

// Schemas y constantes
import { createSaleSchema, type CreateSaleSchema } from "../schemas";
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

const initialValues: CreateSaleSchema = {
  customerId: "",
  paymentMethod: "Efectivo",
  amountPaid: "",
  notes: "",
};

/**
 * Modal ESPECTACULAR para registro de ventas
 * Diseño dividido: Izquierda (productos con scroll) | Derecha (carrito FIJO)
 */
export const FormCreateSaleModal = () => {
  // * Zustand
  const closeCreateSaleModal = useSaleStore(
    useShallow((state) => state.closeCreateSaleModal),
  );
  const cartItems = useSaleStore(useShallow((state) => state.cartItems));
  const addToCart = useSaleStore(useShallow((state) => state.addToCart));
  const removeFromCart = useSaleStore(
    useShallow((state) => state.removeFromCart),
  );
  const updateCartItemQuantity = useSaleStore(
    useShallow((state) => state.updateCartItemQuantity),
  );
  const clearCart = useSaleStore(useShallow((state) => state.clearCart));
  const getCartTotal = useSaleStore(useShallow((state) => state.getCartTotal));

  const user = useAuthStore(useShallow((state) => state.user));

  // * Theme
  const { isDark } = useTheme();

  // * Estados locales
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductForBatch, setSelectedProductForBatch] =
    useState<Product | null>(null);

  // * TanStack Query
  const { clients, isLoading: isLoadingClients } = useGetClients({
    search: "",
    type: "",
    page: 1,
    limit: 1000,
  });

  const { products: allProducts, isLoading: isLoadingProducts } =
    useGetProducts({
      search: searchTerm,
      categoryId: "",
      status: "Disponible",
      lowStock: false,
      page: 1,
      limit: 100,
    });

  // Filtrar productos que tienen stock > 0 y no están vencidos ni vencen hoy
  const products = useMemo(() => {
    return allProducts.filter((product) => {
      // Excluir productos vencidos o que vencen hoy
      if (isProductExpiredOrExpiringToday(product)) {
        return false;
      }

      // Para productos de peso variable, verificar si tienen batches con stock > 0
      if (product.isVariableWeight) {
        return (
          product.batches && product.batches.some((batch) => batch.stock > 0)
        );
      }
      // Para productos fijos, verificar stock directo
      return product.stock > 0;
    });
  }, [allProducts]);

  const { batches, isLoading: isLoadingBatches } = useGetBatches(
    selectedProductForBatch?.id || "",
    !!selectedProductForBatch?.id,
  );

  const { cashRegister, isLoading: isLoadingCashRegister } =
    useGetCurrentCashRegister(user?.id);

  const { useCreateSaleMutation, isPending } = useCreateSale({
    onSuccessCallback: () => {
      closeCreateSaleModal();
      clearCart();
    },
  });

  // * React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateSaleSchema>({
    resolver: zodResolver(createSaleSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const watchedAmountPaid = watch("amountPaid");

  // * Calcular totales
  const cartTotal = getCartTotal();
  const amountPaidNumber = parseFloat(watchedAmountPaid || "0");
  const change = amountPaidNumber - cartTotal;
  const isPaymentSufficient = amountPaidNumber >= cartTotal && cartTotal > 0;

  // * Hook para generar QR
  const { qrUrl, isPaid, isQrLoading, generateQR, transactionId, resetQR } =
    usePaymentQR(cartTotal, cartItems);

  const selectedPaymentMethod = useWatch({ control, name: "paymentMethod" });

  // * Handler para agregar producto al carrito
  const handleAddProductToCart = useCallback(
    (product: Product) => {
      if (product.isVariableWeight) {
        setSelectedProductForBatch(product);
        return;
      }

      // Verificar si el producto ya está en el carrito
      const existingItem = cartItems.find(
        (item) => item.productId === product.id && !item.batchId,
      );

      if (existingItem) {
        // Si ya existe, verificar stock antes de agregar más
        if (existingItem.quantity >= existingItem.availableStock) {
          toast.error(
            `Stock insuficiente. Solo hay ${
              existingItem.availableStock
            } disponible${existingItem.availableStock === 1 ? "" : "s"}`,
          );
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
    },
    [addToCart, cartItems],
  );

  // * Handler para agregar batch al carrito
  const handleAddBatchToCart = useCallback(
    (batch: ProductBatch) => {
      if (!selectedProductForBatch) return;

      // Verificar si el batch ya está en el carrito
      const existingItem = cartItems.find(
        (item) =>
          item.productId === selectedProductForBatch.id &&
          item.batchId === batch.id,
      );

      if (existingItem) {
        // Si ya existe, verificar stock antes de agregar más
        if (existingItem.quantity >= existingItem.availableStock) {
          toast.error(
            `Stock insuficiente. Solo hay ${
              existingItem.availableStock
            } disponible${existingItem.availableStock === 1 ? "" : "s"}`,
          );
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
      toast.success(
        `${selectedProductForBatch.name} (${batch.weight}kg) agregado al carrito`,
      );
      setSelectedProductForBatch(null);
    },
    [selectedProductForBatch, addToCart, cartItems],
  );

  // *Effect de pago

  useEffect(() => {
    if (selectedPaymentMethod !== "QR") resetQR();
  }, [selectedPaymentMethod, resetQR]);

  // * Submit handler
  const onSubmit: SubmitHandler<CreateSaleSchema> = (data) => {
    if (data.paymentMethod === "QR" && !isPaid) {
      toast.error("Debe completar el pago por QR antes de confirmar");
      return;
    }
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

    const saleData = {
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
      // * pago por QR
      transactionId: data.paymentMethod === "QR" ? transactionId : null,
    };

    useCreateSaleMutation.mutate(saleData);
  };

  // * Preparar opciones de clientes
  const clientOptions = clients.map((client) => ({
    label: `${client.firstName} ${client.lastName}`,
    value: client.id || "",
  }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div
        className={`${
          isDark ? "bg-[#0F172A]" : "bg-white"
        } rounded-3xl w-full max-w-7xl h-[90vh] shadow-2xl border-2 ${
          isDark ? "border-[#1E3A8A]/30" : "border-[#275081]/20"
        } flex flex-col overflow-hidden`}
      >
        {/* ========== HEADER FIJO ========== */}
        <div
          className={`flex-shrink-0 ${
            isDark
              ? "bg-gradient-to-r from-[#1E3A8A] via-[#0F172A] to-[#F59E0B]/20"
              : "bg-gradient-to-r from-[#275081] via-white to-[#F9E44E]/30"
          } p-3 border-b ${isDark ? "border-[#334155]" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div
                className={`p-2 rounded-xl ${
                  isDark
                    ? "bg-[#F59E0B]/20 border border-[#F59E0B]/30"
                    : "bg-[#F9E44E]/30 border border-[#275081]/20"
                }`}
              >
                <ShoppingCart
                  className={`w-5 h-5 ${
                    isDark ? "text-[#F59E0B]" : "text-[#275081]"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Registrar Venta
                  </h2>
                  {/* Alerta compacta inline si no hay caja abierta */}
                  {!isLoadingCashRegister && !cashRegister && (
                    <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500 rounded-md px-2 py-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="text-red-500 font-semibold text-[10px] whitespace-nowrap">
                        Caja cerrada
                      </span>
                    </div>
                  )}
                </div>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Selecciona productos y completa la venta
                </p>
              </div>
            </div>
            <button
              onClick={closeCreateSaleModal}
              className={`p-2 ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-[#1E293B]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              } rounded-lg transition-all duration-200 cursor-pointer flex-shrink-0`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========== CONTENIDO PRINCIPAL (GRID 2 COLUMNAS) CON SCROLL ========== */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 min-h-0">
          {/* COLUMNA IZQUIERDA: PRODUCTOS */}
          <div className="lg:col-span-2">
            <ProductSearchSection
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              products={products}
              isLoading={isLoadingProducts}
              onAddToCart={handleAddProductToCart}
            />
          </div>

          {/* COLUMNA DERECHA: CARRITO + CHECKOUT */}
          <div
            className={`lg:col-span-1 flex flex-col ${
              isDark
                ? "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#334155]"
                : "bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200"
            } rounded-2xl p-4 shadow-2xl`}
          >
            {/* Carrito con altura limitada */}
            <div className="flex-shrink-0 mb-4">
              <CartSection
                cartItems={cartItems}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateCartItemQuantity}
              />
            </div>

            {/* Checkout siempre visible */}
            <div
              className={`flex-shrink-0 border-t-2 pt-4 ${
                isDark ? "border-[#334155]" : "border-gray-200"
              }`}
            >
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
                //* pago por QR
                qrUrl={qrUrl}
                isQrLoading={isQrLoading}
                isPaid={isPaid}
                onGenerateQR={generateQR}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de selección de batch */}
      {selectedProductForBatch && (
        <BatchSelectionModal
          product={selectedProductForBatch}
          batches={batches.filter((batch) => batch.stock > 0)}
          isLoading={isLoadingBatches}
          onClose={() => setSelectedProductForBatch(null)}
          onSelectBatch={handleAddBatchToCart}
        />
      )}
    </div>
  );
};
