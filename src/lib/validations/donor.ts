import { z } from "zod";
import { BloodType, Gender, EligibilityStatus } from "@prisma/client";

export const donorSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  bloodType: z.nativeEnum(BloodType, { required_error: "يرجى تحديد فصيلة الدم" }),
  gender: z.nativeEnum(Gender, { required_error: "يرجى تحديد الجنس" }),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "تاريخ الميلاد غير صالح",
  }),
  weight: z.number().min(45, "الوزن يجب أن يكون 45 كجم على الأقل للتبرع"),
  address: z.string().optional(),
  city: z.string().optional(),
  chronicDiseases: z.string().optional(), // Comma separated list in form, transformed to array in action
  eligibilityStatus: z.nativeEnum(EligibilityStatus).default(EligibilityStatus.PENDING_CHECK),
  eligibilityReason: z.string().optional(),
});

export type DonorFormData = z.infer<typeof donorSchema>;
