import zod from "zod";


export const searchClientsSchema = zod.object({
  search: zod.string().optional().default(''),
  type: zod.enum(['Regular', 'VIP', 'Ocasional', '']).optional().default(""),
});

export type SearchClientsSchema = zod.infer<typeof searchClientsSchema>;