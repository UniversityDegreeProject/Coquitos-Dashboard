import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import type { SearchCategoriesSchema } from "../schemas";
import { Layers } from "lucide-react";
import { statusOptions } from "./status-options";

export const categoriesSearchFilterOptions: SelectFilterConfig<SearchCategoriesSchema>[] = [
  {
    name: 'status',
    label: 'Estado',
    options: statusOptions,
    icon: Layers,
    placeholder: 'Todos los estados',
  },
];