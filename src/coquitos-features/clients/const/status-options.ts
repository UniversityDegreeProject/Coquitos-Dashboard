/**
 * Opciones de estado para clientes
 */

export interface StatusOption {
  value: 'Activo' | 'Inactivo' | '';
  label: string;
}

export const statusOptions: StatusOption[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' },
];
