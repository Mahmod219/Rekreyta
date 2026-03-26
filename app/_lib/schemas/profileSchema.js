import { z } from "zod";

export const profileSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(5, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "Address is too short")
    .optional()
    .or(z.literal("")),
  zipcode: z.string().optional().or(z.literal("")),
  city: z
    .string()
    .min(2, "City name is too short")
    .optional()
    .or(z.literal("")),
  coverletter: z
    .string()
    .max(2000, "Cover letter is too long")
    .optional()
    .or(z.literal("")),
});
