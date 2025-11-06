import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import { Users } from "lucide-react";
import { typesOptions } from "./types-options";
import type { SearchClientsSchema } from "../schemas";

export const clientsSearchFilterOptions: SelectFilterConfig<SearchClientsSchema>[] = [
  {
    name: 'type',
    label: 'Tipo',
    options: typesOptions,
    icon: Users,
    placeholder: 'Todos los tipos',
  },
];