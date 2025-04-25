import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
