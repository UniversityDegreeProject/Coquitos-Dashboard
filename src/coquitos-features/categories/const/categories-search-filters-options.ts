import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import type { SearchCategoriesSchema } from "../schemas";
import { Layers, MinusSquare, SquareAsterisk  } from "lucide-react";
import { categoriesOptions } from "./categories-options";
import { minStockOptions } from "./min-stock-options";
import { statusOptions } from "./status-options";


export const categoriesSearchFilterOptions: SelectFilterConfig<SearchCategoriesSchema>[] = [

  {
    name: 'categoryId',
    label: 'Categoría',
    options: categoriesOptions,
    icon: Layers,
    placeholder: 'Todas las categorías',
  },

  {
    name: 'status',
    label: 'Estado',
    options: statusOptions,
    icon: SquareAsterisk,
    placeholder: 'Todos los estados',
  },
  {
    name: 'minStock',
    label: 'Stock mínimo',
    options: minStockOptions,
    icon: MinusSquare,
    placeholder: 'Todos los stocks',
  },
];