import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { salesQueries } from "../const/sales-queries";
import { getSaleById } from "../services/sale.service";
import type { Sale } from "../interfaces";

/**
 * Hook para obtener una venta por su ID
 * Utiliza el parámetro de la URL para obtener el ID
 */
export const useGetSaleById = () => {
  const { saleId } = useParams<{ saleId: string }>();

  const { data, isLoading, error, ...rest } = useQuery<Sale>({
    queryKey: salesQueries.saleById(saleId as string),
    queryFn: () => getSaleById(saleId as string),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: !!saleId,
  });

  return {
    ...rest,
    sale: data,
    isLoading,
    error,
  };
};
