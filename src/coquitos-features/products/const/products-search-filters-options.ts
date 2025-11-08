import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import { statusOptions } from "./status-options";
import type { SearchProductsSchema } from "../schemas";
import { PackageOpen } from "lucide-react";


export const productsSearchFiltersOptions: SelectFilterConfig<SearchProductsSchema>[] = [
  {
    name: 'status',
    label: 'Estado',
    options: statusOptions,
    icon: PackageOpen,
    placeholder: 'Todos los estados',
  },
]; 