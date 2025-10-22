import { z } from 'zod';

/**
 * Esquemas de validación para clientes
 */

export const createClientSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  
  address: z.string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional(),
  
  documentType: z.enum(['CI', 'NIT', 'PASSPORT'], {
    errorMap: () => ({ message: 'Tipo de documento inválido' })
  }),
  
  documentNumber: z.string()
    .min(1, 'El número de documento es requerido')
    .max(50, 'El número de documento no puede exceder 50 caracteres'),
  
  status: z.enum(['Activo', 'Inactivo'])
    .default('Activo'),
  
  notes: z.string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const searchClientsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['Activo', 'Inactivo']).optional(),
  documentType: z.enum(['CI', 'NIT', 'PASSPORT']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type SearchClientsFormData = z.infer<typeof searchClientsSchema>;
