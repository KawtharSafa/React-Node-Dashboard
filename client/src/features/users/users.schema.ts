import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z]+$/, "First name must contain letters only").max(15),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z]+$/, "Last name must contain letters only").max(15),

  email: z.string().min(1, "Email is required").email("Invalid email address").max(200),

  jobTitle: z.string().min(3, "Job title must be at least 3 characters").max(100),
});

export type UserFormValues = z.infer<typeof userSchema>;
