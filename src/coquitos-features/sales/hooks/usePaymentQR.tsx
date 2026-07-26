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

/** Intervalo de polling del estado QR (ms). */
const QR_POLL_INTERVAL_MS = 3000;

interface UsePaymentQRParams {
  cartTotal: number;
  cartItems: CartItem[];
  customerId: string;
  userId: string;
  cashRegisterId: string;
  notes?: string;
}

export const usePaymentQR = ({
  cartTotal,
  cartItems,
  customerId,
  userId,
  cashRegisterId,
  notes,
}: UsePaymentQRParams) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [codigoRecaudacion, setCodigoRecaudacion] = useState<string | null>(
    null,
  );
  const [isPaid, setIsPaid] = useState(false);
  // Venta ya creada en backend al detectar el pago (el cajero confirma en UI)
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const isPaidRef = useRef(false);
  const completedSaleRef = useRef<Sale | null>(null);
  useEffect(() => {
    isPaidRef.current = isPaid;
  }, [isPaid]);
  useEffect(() => {
    completedSaleRef.current = completedSale;
  }, [completedSale]);

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
      setIsPaid(false);
      setCompletedSale(null);
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

  // Polling: solo refleja el pago en UI. El backend ya registra la venta.
  useEffect(() => {
    if (!codigoRecaudacion || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(codigoRecaudacion);

        if (status.pagado && status.saleCompleted && status.sale) {
          setIsPaid(true);
          setCompletedSale(status.sale);
          clearInterval(interval);
          toast.success("¡Pago confirmado!");
        } else if (status.pagado && !status.saleCompleted) {
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
    }, QR_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [codigoRecaudacion, isPaid, cartTotal]);

  /**
   * Libera la reserva solo si aún no hay pago.
   * Antes de cancelar consulta status una vez: si Libélula ya cobró,
   * no cancela y devuelve la venta (para que el cajero no pierda el cobro).
   */
  const cancelQR = useCallback(async (): Promise<{
    alreadyPaid: boolean;
    sale: Sale | null;
  }> => {
    if (!codigoRecaudacion) {
      return { alreadyPaid: false, sale: null };
    }

    if (isPaidRef.current) {
      return { alreadyPaid: true, sale: completedSaleRef.current };
    }

    try {
      const status = await checkPaymentStatus(codigoRecaudacion);
      if (status.pagado && status.saleCompleted) {
        setIsPaid(true);
        if (status.sale) setCompletedSale(status.sale);
        return { alreadyPaid: true, sale: status.sale ?? null };
      }
    } catch (error) {
      console.warn(
        "No se pudo verificar status antes de cancelar; se intenta liberar reserva",
        error,
      );
    }

    if (isPaidRef.current) {
      return { alreadyPaid: true, sale: completedSaleRef.current };
    }

    try {
      await cancelPaymentQR(codigoRecaudacion);
    } catch (error) {
      console.warn("No se pudo liberar la reserva QR", error);
    }

    return { alreadyPaid: false, sale: null };
  }, [codigoRecaudacion]);

  const resetQR = useCallback(() => {
    setQrUrl(null);
    setTransactionId(null);
    setCodigoRecaudacion(null);
    setIsPaid(false);
    setCompletedSale(null);
  }, []);

  return {
    qrUrl,
    isPaid,
    completedSale,
    transactionId,
    codigoRecaudacion,
    isQrLoading: generateQRMutation.isPending,
    generateQR: generateQRMutation.mutate,
    cancelQR,
    resetQR,
  };
};
