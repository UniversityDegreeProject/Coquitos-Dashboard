import type { CategoryStatus } from "../interfaces";

/**
 * Opciones de estado para filtros y formularios
 */
interface StatusOption {
  value: CategoryStatus | "";
  label: string;
}

export const statusOptions: StatusOption[] = [
  { value: "", label: "Todos los estados" },
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

