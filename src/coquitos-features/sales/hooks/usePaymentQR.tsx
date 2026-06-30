import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  generatePaymentQR,
  checkPaymentStatus,
  cancelPaymentQR,
} from "../services/payment.service";
import { toast } from "sonner";
import type { CartItem, Sale } from "../interfaces";

interface UsePaymentQRParams {
  cartTotal: number;
  cartItems: CartItem[];
  customerId: string;
  userId: string;
  cashRegisterId: string;
  notes?: string;
  // Se ejecuta cuando el backend confirma el pago y registra la venta
  onSaleCompleted?: (sale: Sale) => void;
}

export const usePaymentQR = ({
  cartTotal,
  cartItems,
  customerId,
  userId,
  cashRegisterId,
  notes,
  onSaleCompleted,
}: UsePaymentQRParams) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [codigoRecaudacion, setCodigoRecaudacion] = useState<string | null>(
    null,
  );
  const [isPaid, setIsPaid] = useState(false);

  // Mantener el callback más reciente sin re-suscribir el polling
  const onSaleCompletedRef = useRef(onSaleCompleted);
  useEffect(() => {
    onSaleCompletedRef.current = onSaleCompleted;
  }, [onSaleCompleted]);

  const generateQRMutation = useMutation({
    mutationFn: () =>
      generatePaymentQR({
        customerId,
        userId,
        cashRegisterId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          batchId: item.batchId,
        })),
        notes,
      }),
    onSuccess: (data) => {
      setQrUrl(data.qr_simple_url);
      setTransactionId(data.id_transaccion);
      setCodigoRecaudacion(data.codigo_recaudacion);
      toast.success("QR generado exitosamente");
    },
    onError: (error) => {
      const data =
        error instanceof AxiosError
          ? (error.response?.data as { error?: string } | undefined)
          : undefined;
      toast.error(data?.error ?? "Error al generar el código QR");
    },
  });

  // Polling del estado de pago: el backend completa la venta al primer pago
  useEffect(() => {
    if (!codigoRecaudacion || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(codigoRecaudacion);

        if (status.pagado && status.saleCompleted && status.sale) {
          setIsPaid(true);
          clearInterval(interval);
          toast.success("¡Pago confirmado!");
          onSaleCompletedRef.current?.(status.sale);
        } else if (status.pagado && !status.saleCompleted) {
          // Pago detectado pero el monto no cubre el total
          toast.error(
            `El pago recibido no cubre el total (${cartTotal.toFixed(
              2,
            )} Bs). Contacte al administrador.`,
          );
          clearInterval(interval);
        }
      } catch (error) {
        console.warn("Reintentando consulta de pago...", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [codigoRecaudacion, isPaid, cartTotal]);

  // Libera la reserva de stock en el backend (solo si no se pagó aún)
  const cancelQR = useCallback(async () => {
    if (!codigoRecaudacion || isPaid) return;
    try {
      await cancelPaymentQR(codigoRecaudacion);
    } catch (error) {
      console.warn("No se pudo liberar la reserva QR", error);
    }
  }, [codigoRecaudacion, isPaid]);

  const resetQR = useCallback(() => {
    setQrUrl(null);
    setTransactionId(null);
    setCodigoRecaudacion(null);
    setIsPaid(false);
  }, []);

  return {
    qrUrl,
    isPaid,
    transactionId,
    codigoRecaudacion,
    isQrLoading: generateQRMutation.isPending,
    generateQR: generateQRMutation.mutate,
    cancelQR,
    resetQR,
  };
};
