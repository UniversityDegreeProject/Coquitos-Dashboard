import { z } from "zod";

export const searchActivityLogSchema = z.object({
  search: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  dateRange: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type SearchActivityLogSchema = z.infer<typeof searchActivityLogSchema>;
