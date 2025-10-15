import type { Status } from "../interfaces";

interface StatusOption {
  value: Status | "";
  label: string;
}

export const statusOptions : StatusOption[] = [
  { value: "", label: "Todos los estados" },
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
  { value: "Suspendido", label: "Suspendido" },
];
