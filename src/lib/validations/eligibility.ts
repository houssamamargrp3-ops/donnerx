import { z } from "zod";

export const eligibilitySchema = z.object({
  age: z.number().min(18, "يجب أن يكون العمر 18 عاماً على الأقل").max(65, "يجب أن لا يتجاوز العمر 65 عاماً"),
  weight: z.number().min(50, "يجب أن يكون الوزن 50 كجم على الأقل للتبرع"),
  isPregnant: z.enum(["true", "false"]),
  recentSurgery: z.enum(["true", "false"]),
  hasRecentTattoo: z.enum(["true", "false"]),
  recentTravel: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
});

export type EligibilityFormData = z.infer<typeof eligibilitySchema>;
