import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
