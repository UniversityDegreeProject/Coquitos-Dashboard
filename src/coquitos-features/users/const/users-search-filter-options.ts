import type { SelectFilterConfig } from "@/shared/components/GenericSearchBar";
import type { SearchUsersSchema } from "../schemas";
import { roleOptions } from "./role-options";
import { statusOptions } from "./status-options";
import { Shield, UserCheck } from "lucide-react";


export const usersSearchFilterOptions: SelectFilterConfig<SearchUsersSchema>[] = [

  {
    name: 'role',
    label: 'Rol',
    options: roleOptions,
    icon: Shield,
    placeholder: 'Filtrar por rol',
  },

  {
    name: 'status',
    label: 'Estado',
    options: statusOptions,
    icon: UserCheck,
    placeholder: 'Filtrar por estado',
  },
];