import { z } from "zod";

export const ListSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export type ListDto = z.infer<typeof ListSchema>;
