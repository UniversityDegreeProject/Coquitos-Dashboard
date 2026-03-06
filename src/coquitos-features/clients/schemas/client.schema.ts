import { z } from "zod";

/**
 * Esquemas de validación para clientes
 */

export const createClientSchema = z.object({
  id: z.uuid().optional(),

  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .max(20, "El nombre no puede exceder 20 caracteres")
    .regex(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/, {
      message:
        "El nombre debe comenzar con mayúscula, solo letras y sin espacios al inicio/final",
    }),

  lastName: z
    .string()
    .min(1, "El apellido es requerido")
    .max(20, "El apellido no puede exceder 20 caracteres")
    .regex(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/, {
      message:
        "El apellido debe comenzar con mayúscula, solo letras y sin espacios al inicio/final",
    }),

  email: z
    .string()
    .email("Email inválido")
    .max(100, "El email no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .refine((val) => !val || /^\d{8}$/.test(val) || /^\+\d{11}$/.test(val), {
      message:
        "Debe ingresar 8 números si es local o 11 números con el prefijo internacional (+59161853613)",
    })
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, "La dirección no puede exceder 200 caracteres")
    .optional()
    .or(z.literal("")),

  type: z.enum(["Regular", "VIP", "Ocasional"], {
    error: "Tipo de cliente inválido",
  }),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientFormData = z.infer<typeof createClientSchema>;
