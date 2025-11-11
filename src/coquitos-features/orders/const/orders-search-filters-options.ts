import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import type { SearchOrdersSchema } from "../schemas";
import { CreditCard, CheckCircle } from "lucide-react";
import { paymentMethodOptions } from "./payment-method-options";
import { statusOptions } from "./status-options";

/**
 * Configuración de filtros para el buscador genérico de órdenes
 */
export const ordersSearchFiltersOptions: SelectFilterConfig<SearchOrdersSchema>[] = [
  {
    name: 'paymentMethod',
    label: 'Método de Pago',
    options: paymentMethodOptions,
    icon: CreditCard,
    placeholder: 'Todos los métodos',
  },
  {
    name: 'status',
    label: 'Estado',
    options: statusOptions,
    icon: CheckCircle,
    placeholder: 'Todos los estados',
  },
];

