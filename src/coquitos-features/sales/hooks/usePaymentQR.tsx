import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  generatePaymentQR,
  checkPaymentStatus,
} from "../services/payment.service";
import { toast } from "sonner";
import type { CartItem } from "../interfaces";

export const usePaymentQR = (cartTotal: number, cartItems: CartItem[]) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [codigoRecaudacion, setCodigoRecaudacion] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const generateQRMutation = useMutation({
    mutationFn: () => {
      // 1. Limpiamos los datos: Enviamos solo lo necesario
      const cleanItems = cartItems.map((i) => ({
        concepto: i.productName,
        cantidad: i.quantity,
        costo_unitario: i.unitPrice,
      }));

      // 2. Llamamos al servicio con los datos limpios y el monto total
      return generatePaymentQR({
        amount: cartTotal,
        items: cleanItems,
      });
    },
    onSuccess: (data) => {
      setQrUrl(data.qr_simple_url);
      // Guardamos AMBOS identificadores
      setTransactionId(data.id_transaccion);
      setCodigoRecaudacion(data.codigo_recaudacion);
      toast.success("QR generado exitosamente");
    },
    onError: (error) => {
      console.error("Error detalle:", error);
      toast.error("Error al generar el código QR");
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (codigoRecaudacion && !isPaid) {
      interval = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(codigoRecaudacion);

          if (status && status.pagado === true) {
            // ★ VALIDACIÓN DE MONTO: Verificar que el monto pagado coincide
            if (status.valor_total >= cartTotal) {
              setIsPaid(true);
              toast.success("¡Pago confirmado!");
              clearInterval(interval);
            } else {
              // El cliente pagó menos de lo esperado
              toast.error(
                `El monto pagado (${status.valor_total} Bs) no coincide con el total (${cartTotal.toFixed(2)} Bs). Contacte al administrador.`,
              );
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.log("Error detalle:", error);
          console.warn("Reintentando consulta de pago...");
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [codigoRecaudacion, isPaid, cartTotal]);

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
    resetQR,
  };
};
