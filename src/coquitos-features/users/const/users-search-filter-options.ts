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
    placeholder: 'Todos los roles',
  },

  {
    name: 'status',
    label: 'Estado',
    options: statusOptions,
    icon: UserCheck,
    placeholder: 'Todos los estados',
  },
];