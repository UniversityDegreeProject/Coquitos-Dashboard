import { z as zod } from "zod";

export const createUserSchema = zod.object({
  id: zod.uuid().optional(),
  username: zod
    .string({ error: "Usuario es requerido" })
    .min(3, { error: "El usuario debe tener al menos 3 caracteres" })
    .max(20, { error: "El usuario debe tener máximo 20 caracteres" })
    .toLowerCase(),
  email: zod
    .email({ error: "Formato de email invalido" })
    .min(1, { error: "El email no puede estar vacio" })
    .toLowerCase(),
  emailVerified: zod.boolean(),
  password: zod
    .string()
    .min(6, { message: "Contraseña debe tener al menos 6 caracteres" })
    .max(16, { message: "Contraseña debe tener máximo 16 caracteres" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      { 
        message: "Contraseña debe tener al menos una letra mayuscula, una letra minuscula, un numero y un caracter especial" 
      }
    )
    .optional(),
  firstName: zod
    .string({ error: "Nombre es requerido" })
    .min(1, { error: "El nombre no puede estar vacio" })
    .regex(/^[A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { error: "El nombre debe comenzar con letra mayúscula y solo puede contener letras" }),
  
  lastName: zod
    .string({ error: "Apellido es requerido" })
    .min(1, { error: "El apellido no puede estar vacio" })
    .regex(/^[A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { error: "El apellido debe comenzar con letra mayúscula y solo puede contener letras" }),
  
  phone: zod
    .string({ error: "Teléfono es requerido" })
    .refine(
      val =>
        (/^\d{8}$/.test(val)) ||
        (/^\+\d{11}$/.test(val)),
      {
        message:
          "Debe ingresar 8 números si es local o 11 números con el prefijo internacional (+59161853613)",
      }
    ),
  
  role: zod.enum(["Administrador", "Cajero"], { 
    error: "Rol es requerido" 
  }),
  
  status: zod.enum(["Activo", "Inactivo", "Suspendido"], { 
    error: "Estado es requerido" 
  }),
});

export type RegisterUserSchema = zod.infer<typeof createUserSchema>;