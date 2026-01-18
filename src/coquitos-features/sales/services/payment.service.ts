import { CoquitoApi } from "@/config/axios.adapter";
import type {
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
  transactionId: string,
): Promise<PaymentStatusResponse> => {
  const response = await CoquitoApi.get<PaymentStatusResponse>(
    `/payments/status/${transactionId}`,
  );
  return response.data;
};
