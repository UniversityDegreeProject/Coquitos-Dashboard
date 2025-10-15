import type { Role } from "../interfaces";

// * Constantes fuera del componente para evitar recreación
interface RoleOption {
  value: Role | "";
  label: string;
}

export const roleOptions : RoleOption[] = [
  { value: "", label: "Todos los roles" },
  { value: "Administrador", label: "Administrador" },
  { value: "Cajero", label: "Cajero" },
];