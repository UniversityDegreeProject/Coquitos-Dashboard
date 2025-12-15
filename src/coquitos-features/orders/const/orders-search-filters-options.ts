import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import type { SearchOrdersSchema } from "../schemas";
import { CreditCard, CheckCircle, Calendar } from "lucide-react";
import { paymentMethodOptions } from "./payment-method-options";
import { statusOptions } from "./status-options";
import { filtersDateRangeOptions } from "./filters-date-range-otpions";

/**
 * Configuración de filtros para el buscador genérico de órdenes
 */
export const ordersSearchFiltersOptions: SelectFilterConfig<SearchOrdersSchema>[] =
  [
    {
      name: "paymentMethod",
      label: "Método de Pago",
      options: paymentMethodOptions,
      icon: CreditCard,
      placeholder: "Todos los métodos",
    },
    {
      name: "status",
      label: "Estado",
      options: statusOptions,
      icon: CheckCircle,
      placeholder: "Todos los estados",
    },
    {
      name: "dateRange",
      label: "Filtrar ventas",
      options: filtersDateRangeOptions,
      icon: Calendar,
      placeholder: "Todos los rangos",
    },
  ];
