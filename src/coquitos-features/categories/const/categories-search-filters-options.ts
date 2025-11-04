import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import type { SearchCategoriesSchema } from "../schemas";
import { SquareAsterisk  } from "lucide-react";
import { statusOptions } from "./status-options";


export const categoriesSearchFilterOptions: SelectFilterConfig<SearchCategoriesSchema>[] = [


  {
    name: 'status',
    label: 'Estado',
    options: statusOptions,
    icon: SquareAsterisk,
    placeholder: 'Todos los estados',
  },
  
];