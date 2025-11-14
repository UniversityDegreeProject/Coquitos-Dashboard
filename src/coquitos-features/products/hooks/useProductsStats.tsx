import { useQuery } from "@tanstack/react-query";
import { productsQueries } from "../const";
import type { SearchProductsParams } from "../interfaces";
import { getProducts } from "../services/product.service";


export interface ProductsStatsData {
  totalProducts: number;
  availableProducts: number;
  lowStockProducts: number;
  totalValue: number;
}

export const useProductsStats = ( filters : Pick<SearchProductsParams, 'status' | 'search' | 'categoryId'>) => {
  const useQueryProductsStats = useQuery({

    queryKey: [...productsQueries.allProducts, 'stats', filters],

    queryFn: async () => {
      const response = await getProducts({
        ...filters,
        page : 1,
        limit : 100, 
      });

      return response;
    },

    staleTime:30000, // Sin tiempo de caché para que se actualice inmediatamente
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: true,
  });


    // * Calcular estadísticas
  const productsStats: ProductsStatsData = {
    totalProducts: useQueryProductsStats.data?.total ?? 0,
    availableProducts: useQueryProductsStats.data?.data.filter(p => p.status === 'Disponible').length ?? 0,
    lowStockProducts: useQueryProductsStats.data?.data.filter(p => p.stock <= p.minStock && p.status !== 'SinStock').length ?? 0,
    totalValue: useQueryProductsStats.data?.data.reduce((sum, product) => {
      // Para productos de peso variable, calcular desde batches si están disponibles
      if (product.isVariableWeight) {
        // Si hay batches, calcular la suma de unitPrice * stock de cada batch
        if (product.batches && product.batches.length > 0) {
          const calculatedTotal = product.batches.reduce((batchSum, batch) => {
            const unitPrice = Number(batch.unitPrice) || 0;
            const stock = Number(batch.stock) || 0;
            return batchSum + (unitPrice * stock);
          }, 0);
          return sum + calculatedTotal;
        }
        // Fallback al precio del producto si no hay batches
        return sum + (Number(product.price) || 0);
      }
      // Para productos normales, multiplicar price × stock
      const price = Number(product.price) || 0;
      const stock = Number(product.stock) || 0;
      return sum + (price * stock);
    }, 0) ?? 0,
  };

  return {
    ...useQueryProductsStats,
    productsStats,
  };
}