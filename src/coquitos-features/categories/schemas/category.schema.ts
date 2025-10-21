import { z as zod } from "zod";

/**
 * Schema de validación para crear/actualizar categoría
 */
export const createCategorySchema = zod.object({
  id: zod.uuid().optional(),
  name: zod
    .string({ message: "Nombre es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres" })
    .regex(/^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
      message: "El nombre debe comenzar con letra mayúscula y solo puede contener letras" 
    }),
  description: zod
    .string({ message: "Descripción es requerida" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(200, { message: "La descripción debe tener máximo 200 caracteres" }),
  status: zod.enum(["Activo", "Inactivo"], { 
    message: "Estado es requerido" 
  }),
});

export type CategorySchema = zod.infer<typeof createCategorySchema>;

