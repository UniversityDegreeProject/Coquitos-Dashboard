/**
 * Opciones de tipos de cliente
 */

export interface ClientTypeOption {
  value: 'Regular' | 'VIP' | 'Ocasional' | '';
  label: string;
}

export const clientTypeOptions: ClientTypeOption[] = [
  { value: '', label: 'Seleccionar tipo' },
  { value: 'Regular', label: 'Cliente Regular' },
  { value: 'VIP', label: 'Cliente VIP' },
  { value: 'Ocasional', label: 'Cliente Ocasional' },
];
