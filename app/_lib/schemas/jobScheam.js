import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(3, "Company name must be at least 3 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  employmentType: z.string().min(3, "must be at least 3 characters"),
  description: z.string().min(100, "must be at least 100 characters"),
  salary: z.string().min(3, "Salary must be at least 3 characters"),
  duration: z.string().min(3, " Must be at least 3 characters"),
  address: z.string().min(3, "Address must be at least 3 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  application_deadline: z.string().optional(),
});
