import { useQuery } from "@tanstack/react-query";
import { productsQueries } from "../const";
import { getEffectiveStatus, isProductNearExpiration } from "../helpers";
import type { Product, SearchProductsParams } from "../interfaces";
import { getProducts } from "../services/product.service";

export interface ProductsStatsData {
  totalProducts: number;
  availableProducts: number;
  lowStockProducts: number;
  nearExpirationProducts: number;
  totalValue: number;
}

const filterByEffectiveStatus = (
  products: Product[],
  status: SearchProductsParams["status"],
): Product[] => {
  if (!status || String(status).trim() === "") {
    return products;
  }
  return products.filter((p) => getEffectiveStatus(p) === status);
};

export const useProductsStats = (
  filters: Pick<SearchProductsParams, "status" | "search" | "categoryId">,
) => {
  const useQueryProductsStats = useQuery({
    queryKey: [...productsQueries.allProducts, "stats", filters],

    queryFn: async () => {
      const response = await getProducts({
        ...filters,
        page: 1,
        limit: 100,
      });

      return response;
    },

    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: true,
  });

  const rawProducts = useQueryProductsStats.data?.data ?? [];
  const products = filterByEffectiveStatus(rawProducts, filters.status);

  const productsStats: ProductsStatsData = {
    totalProducts: products.length,
    availableProducts: products.filter(
      (p) => getEffectiveStatus(p) === "Disponible",
    ).length,
    lowStockProducts: products.filter(
      (p) =>
        p.stock > 0 &&
        p.stock <= p.minStock &&
        getEffectiveStatus(p) !== "SinStock",
    ).length,
    nearExpirationProducts: products.filter(
      (p) =>
        p.stock > 0 &&
        getEffectiveStatus(p) !== "SinStock" &&
        isProductNearExpiration(p),
    ).length,
    totalValue: products.reduce((sum, product) => {
      if (product.isVariableWeight) {
        if (product.batches && product.batches.length > 0) {
          const calculatedTotal = product.batches.reduce((batchSum, batch) => {
            const unitPrice = Number(batch.unitPrice) || 0;
            const stock = Number(batch.stock) || 0;
            return batchSum + unitPrice * stock;
          }, 0);
          return sum + calculatedTotal;
        }
        return sum + (Number(product.price) || 0);
      }
      const price = Number(product.price) || 0;
      const stock = Number(product.stock) || 0;
      return sum + price * stock;
    }, 0),
  };

  return {
    ...useQueryProductsStats,
    productsStats,
  };
};
