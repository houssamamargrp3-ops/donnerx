import * as z from "zod";

export const eligibilitySchema = z.object({
  donorId: z.string().min(1, "رقم المتبرع مطلوب"),
  age: z.number().min(18, "يجب أن يكون العمر 18 سنة على الأقل").max(65, "يجب ألا يتجاوز العمر 65 سنة"),
  weight: z.number().min(50, "يجب أن يكون الوزن 50 كجم على الأقل"),
  bloodPressureSystolic: z.number().min(90, "الضغط الانقباضي منخفض جداً").max(180, "الضغط الانقباضي مرتفع جداً").optional().nullable(),
  bloodPressureDiastolic: z.number().min(50, "الضغط الانبساطي منخفض جداً").max(100, "الضغط الانبساطي مرتفع جداً").optional().nullable(),
  hemoglobin: z.number().min(10, "نسبة الهيموغلوبين منخفضة جداً").max(20, "نسبة الهيموغلوبين مرتفعة جداً").optional().nullable(),
  isPregnant: z.boolean(),
  recentSurgery: z.boolean(),
  hasRecentTattoo: z.boolean(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  recentTravel: z.string().optional(),
});

export type EligibilityFormData = z.infer<typeof eligibilitySchema>;
