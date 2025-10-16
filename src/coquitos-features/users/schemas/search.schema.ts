import { z as zod } from "zod";

export const searchSchema = zod.object({
  search: zod.string().min(1, { error: "La búsqueda es requerida" }).optional(),
  role: zod.enum(["Administrador", "Cajero"]).optional(),
  status: zod.enum(["Activo", "Inactivo", "Suspendido"]).optional(),
});


export type SearchSchema = zod.infer<typeof searchSchema>;