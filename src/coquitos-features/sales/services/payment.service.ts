import { CoquitoApi } from "@/config/axios.adapter";
import type {
  CancelQRResponse,
  GenerateQRRequest,
  GenerateQRResponse,
  PaymentStatusResponse,
} from "../interfaces";

export const generatePaymentQR = async (
  data: GenerateQRRequest,
): Promise<GenerateQRResponse> => {
  const response = await CoquitoApi.post<GenerateQRResponse>(
    "/payments/generate-qr",
    data,
  );
  return response.data;
};

export const checkPaymentStatus = async (
  codigoRecaudacion: string,
): Promise<PaymentStatusResponse> => {
  const response = await CoquitoApi.get<PaymentStatusResponse>(
    `/payments/status/${codigoRecaudacion}`,
  );
  return response.data;
};

export const cancelPaymentQR = async (
  codigoRecaudacion: string,
): Promise<CancelQRResponse> => {
  const response = await CoquitoApi.post<CancelQRResponse>(
    "/payments/cancel-qr",
    { codigoRecaudacion },
  );
  return response.data;
};
