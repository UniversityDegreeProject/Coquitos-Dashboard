import type {
  SelectFilterConfig,
  DateFilterConfig,
} from "@/shared/components/GenericSearchBar";
import type { SearchActivityLogSchema } from "../schemas/search-activity-log.schema";
import { Activity, Database, Calendar } from "lucide-react";

export const actionOptions = [
  { value: "CREATE", label: "Crear" },
  { value: "UPDATE", label: "Actualizar" },
  { value: "DELETE", label: "Eliminar" },
  { value: "LOGIN", label: "Inicio de sesión" },
  { value: "LOGOUT", label: "Cierre de sesión" },
];

export const entityOptions = [
  { value: "User", label: "Usuarios" },
  { value: "Product", label: "Productos" },
  { value: "Sale", label: "Ventas" },
  { value: "CashRegister", label: "Caja" },
  { value: "Category", label: "Categorías" },
  { value: "Customer", label: "Clientes" },
  { value: "ProductBatch", label: "Lotes" },
  { value: "System", label: "Sistema" },
];

export const dateRangeOptions = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
];

export const activityLogSearchFiltersOptions: SelectFilterConfig<SearchActivityLogSchema>[] =
  [
    {
      name: "action",
      label: "Acción",
      options: actionOptions,
      icon: Activity,
      placeholder: "Todas las acciones",
    },
    {
      name: "entity",
      label: "Entidad",
      options: entityOptions,
      icon: Database,
      placeholder: "Todas las entidades",
    },
    {
      name: "dateRange",
      label: "Periodo",
      options: dateRangeOptions,
      icon: Calendar,
      placeholder: "Todos los periodos",
    },
  ];

export const activityLogDateFilters: DateFilterConfig<SearchActivityLogSchema>[] =
  [
    {
      name: "startDate",
      label: "Fecha Inicio",
      placeholder: "Seleccionar fecha",
    },
    {
      name: "endDate",
      label: "Fecha Fin",
      placeholder: "Seleccionar fecha",
    },
  ];
