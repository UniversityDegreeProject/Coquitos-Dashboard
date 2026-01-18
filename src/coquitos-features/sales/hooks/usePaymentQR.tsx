import { useState, useEffect } from "react";
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
  const [isPaid, setIsPaid] = useState(false);

  // En usePaymentQR.ts
  const generateQRMutation = useMutation({
    mutationFn: () => {
      // 1. Limpiamos los datos: Enviamos solo lo necesario
      const cleanItems = cartItems.map((i) => ({
        concepto: i.productName, // Nombre legible para el banco
        cantidad: i.quantity, // Número
        costo_unitario: i.unitPrice, // Número
      }));

      // 2. Llamamos al servicio con los datos limpios y el monto total
      return generatePaymentQR({
        amount: cartTotal,
        items: cleanItems,
      });
    },
    onSuccess: (data) => {
      setQrUrl(data.qr_simple_url);
      // Usamos el código de recaudación para el polling constante
      setTransactionId(data.codigo_recaudacion);
      toast.success("QR generado exitosamente");
    },
    onError: (error) => {
      console.error("Error detalle:", error);
      toast.error("Error al generar el código QR");
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (transactionId && !isPaid) {
      interval = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(transactionId);
          // Validamos que status y status.pagado existan
          if (status && status.pagado === true) {
            setIsPaid(true);
            toast.success("¡Pago confirmado!");
            clearInterval(interval);
          }
        } catch (error) {
          console.log("Error detalle:", error);
          // Ignoramos errores de red momentáneos de ngrok
          console.warn("Reintentando consulta de pago...");
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [transactionId, isPaid]);

  const resetQR = () => {
    setQrUrl(null);
    setTransactionId(null);
    setIsPaid(false);
  };

  return {
    qrUrl,
    isPaid,
    transactionId,
    isQrLoading: generateQRMutation.isPending,
    generateQR: generateQRMutation.mutate,
    resetQR,
  };
};
