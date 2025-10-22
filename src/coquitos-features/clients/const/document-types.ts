/**
 * Opciones de tipos de documento para clientes
 */

export interface DocumentTypeOption {
  value: 'CI' | 'NIT' | 'PASSPORT' | '';
  label: string;
}

export const documentTypeOptions: DocumentTypeOption[] = [
  { value: '', label: 'Seleccionar tipo' },
  { value: 'CI', label: 'Cédula de Identidad' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PASSPORT', label: 'Pasaporte' },
];
