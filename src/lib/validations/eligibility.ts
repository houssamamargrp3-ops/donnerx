import { z } from "zod";

export const eligibilitySchema = z.object({
  age: z.number({ required_error: "يرجى إدخال العمر", invalid_type_error: "يجب أن يكون رقماً" }).min(18, "يجب أن يكون العمر 18 عاماً على الأقل").max(65, "يجب أن لا يتجاوز العمر 65 عاماً"),
  weight: z.number({ required_error: "يرجى إدخال الوزن", invalid_type_error: "يجب أن يكون رقماً" }).min(50, "يجب أن يكون الوزن 50 كجم على الأقل للتبرع"),
  isPregnant: z.enum(["true", "false"]).transform((v) => v === "true"),
  recentSurgery: z.enum(["true", "false"]).transform((v) => v === "true"),
  hasRecentTattoo: z.enum(["true", "false"]).transform((v) => v === "true"),
  recentTravel: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
});

export type EligibilityInput = z.input<typeof eligibilitySchema>;
export type EligibilityFormData = z.infer<typeof eligibilitySchema>;
