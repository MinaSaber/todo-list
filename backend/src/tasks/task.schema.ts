import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.preprocess((val) => new Date(val as string), z.date()),
  listId: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  status: z.enum(["PENDING", "COMPLETED"]),
});

export type TaskDto = z.infer<typeof TaskSchema>;
