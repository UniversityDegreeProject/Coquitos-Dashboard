import { z } from 'zod';

/**
 * Esquemas de validación para clientes
 */

export const createClientSchema = z.object({
  id : z.uuid()
  .optional(),
  
  firstName: z.string()
    .min(1, 'El nombre es requerido')
    .max(20, 'El nombre no puede exceder 20 caracteres')
    .regex(/^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { error: 'El nombre debe comenzar con letra mayúscula y solo puede contener letras' }),

  
  lastName: z.string()
    .min(1, 'El apellido es requerido')
    .max(20, 'El apellido no puede exceder 20 caracteres')
    .regex(/^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { error: 'El apellido debe comenzar con letra mayúscula y solo puede contener letras' }),

  
  email: z.email('Email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .refine( ( val ) => (/^\d{8}$/.test(val)) || (/^\+\d{11}$/.test(val)), {
      message: 'Debe ingresar 8 números si es local o 11 números con el prefijo internacional (+59161853613)'
    }),
  address: z.string()
    .min(1, 'La dirección es requerida')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .regex(/^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,#-/]+$/, { error: 'La direecion solo puede contener letras, números, espacios, comas, #, - y /' }),

  type: z.enum(['Regular', 'VIP', 'Ocasional'], {
    error: 'Tipo de cliente inválido'
  }),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientFormData = z.infer<typeof createClientSchema>;
