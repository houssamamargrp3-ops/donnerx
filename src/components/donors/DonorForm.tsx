"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donorSchema, DonorFormData } from "@/lib/validations/donor";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Droplet, Calendar, Heart, Phone, MapPin, AlertCircle, CheckCircle2, ShieldCheck, Mail } from "lucide-react";
import { createDonor, updateDonor } from "@/app/actions/donor.actions";
import { BloodType, Gender, EligibilityStatus } from "@prisma/client";

interface DonorFormProps {
  initialData?: Partial<DonorFormData> & { id?: string };
  isEdit?: boolean;
}

const BLOOD_TYPES: { value: BloodType; label: string }[] = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

export default function DonorForm({ initialData, isEdit }: DonorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      bloodType: initialData?.bloodType,
      gender: initialData?.gender || "MALE",
      dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split("T")[0] : "",
      weight: initialData?.weight || 60,
      address: initialData?.address || "",
      city: initialData?.city || "",
      chronicDiseases: initialData?.chronicDiseases || "",
      eligibilityStatus: initialData?.eligibilityStatus || "PENDING_CHECK",
      eligibilityReason: initialData?.eligibilityReason || "",
    },
  });

  const onSubmit = (data: DonorFormData) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      let result;
      if (isEdit && initialData?.id) {
        result = await updateDonor(initialData.id, data);
      } else {
        result = await createDonor(data);
      }

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(isEdit ? "تم تحديث البيانات بنجاح!" : "تمت إضافة المتبرع وحسابه بنجاح!");
        setTimeout(() => {
          router.push("/dashboard/donors");
          router.refresh();
        }, 1500);
      }
    });
  };

  return (
    <div className="stats-card animate-fade-in-up">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-red-400" />
              البيانات الشخصية
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" {...register("name")} className="form-input pr-10" placeholder="محمد أحمد..." />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" {...register("email")} className="form-input pr-10" placeholder="donor@example.com" dir="ltr" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">تاريخ الميلاد</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="date" {...register("dateOfBirth")} className="form-input pr-10" />
                </div>
                {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">الجنس</label>
                <select {...register("gender")} className="form-input">
                  <option value="MALE">ذكر</option>
                  <option value="FEMALE">أنثى</option>
                </select>
                {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              البيانات الطبية
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">فصيلة الدم</label>
                <div className="relative">
                  <Droplet className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                  <select {...register("bloodType")} className="form-input pr-10" defaultValue="">
                    <option value="" disabled>اختر الفصيلة</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.bloodType && <p className="text-red-400 text-xs mt-1">{errors.bloodType.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">الوزن (كجم)</label>
                <input type="number" step="0.1" {...register("weight", { valueAsNumber: true })} className="form-input" placeholder="60" />
                {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">حالة الأهلية</label>
              <div className="relative">
                <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select {...register("eligibilityStatus")} className="form-input pr-10">
                  <option value="ELIGIBLE">مؤهل للتبرع</option>
                  <option value="PENDING_CHECK">قيد الفحص</option>
                  <option value="INELIGIBLE">غير مؤهل</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">أمراض مزمنة (مفصولة بفاصلة إن وجدت)</label>
              <input type="text" {...register("chronicDiseases")} className="form-input" placeholder="مثال: السكري, الضغط..." />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 md:col-span-2 mt-4 pt-6 border-t border-white/5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-red-400" />
              معلومات الاتصال
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" {...register("phone")} className="form-input pr-10" placeholder="+966 50 123 4567" dir="ltr" />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">المدينة</label>
                <input type="text" {...register("city")} className="form-input" placeholder="الرياض..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">العنوان التفصيلي</label>
                <input type="text" {...register("address")} className="form-input" placeholder="شارع العليا..." />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-white/5 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-bold transition-all hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 4px 15px rgba(220,38,38,0.3)",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isEdit ? "حفظ التعديلات" : "إضافة المتبرع"}
          </button>
        </div>
      </form>
    </div>
  );
}
