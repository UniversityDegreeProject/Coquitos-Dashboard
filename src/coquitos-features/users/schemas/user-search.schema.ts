import { z as zod } from "zod";

export const userSearchSchema = zod.object({
  search: zod.string().optional().default(""),
  role: zod.enum(["Administrador", "Vendedor", ""]).optional().default(""),
  status: zod
    .enum(["Activo", "Inactivo", "Suspendido", ""])
    .optional()
    .default(""),
});

export type SearchUsersSchema = zod.infer<typeof userSearchSchema>;
