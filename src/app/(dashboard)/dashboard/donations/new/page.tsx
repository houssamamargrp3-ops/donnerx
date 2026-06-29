import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RecordDonationForm from "./RecordDonationForm";
import { Droplet, Calendar, User } from "lucide-react";

export const metadata = { title: "تسجيل تبرع جديد" };

export default async function NewDonationPage({ searchParams }: { searchParams: { appointmentId?: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const appointmentId = searchParams.appointmentId;
  if (!appointmentId) {
    return (
      <div className="p-8 text-center text-red-500">
        يجب اختيار موعد أولاً لتسجيل التبرع. ارجع إلى التقويم واختر الموعد.
      </div>
    );
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      donor: true,
      center: true,
    }
  });

  if (!appointment) {
    return <div className="p-8 text-center text-red-500">الموعد غير موجود.</div>;
  }

  if (appointment.status === "COMPLETED") {
    return (
      <div className="p-8 text-center text-emerald-600 font-bold">
        تم تسجيل التبرع لهذا الموعد مسبقاً!
      </div>
    );
  }

  // Calculate default next eligible date (3 months = 90 days)
  const defaultNextDate = new Date();
  defaultNextDate.setDate(defaultNextDate.getDate() + 90);

  return (
    <div className="space-y-6 mt-4 max-w-4xl mx-auto">
      <div className="labo-page-title mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplet className="w-6 h-6 text-red-600" />
            تسجيل عملية التبرع بالدم
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            يرجى التأكد من بيانات المتبرع وكمية الدم المسحوبة قبل الحفظ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          {/* Info Cards */}
          <div className="labo-card p-5 bg-slate-50 border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
              <User className="w-4 h-4 text-slate-500" />
              بيانات المتبرع
            </h3>
            <p className="text-sm text-slate-600 mb-1"><strong>الاسم:</strong> {appointment.donor.firstName} {appointment.donor.lastName}</p>
            <p className="text-sm text-slate-600 mb-1"><strong>الهوية:</strong> {appointment.donor.nationalId}</p>
            <p className="text-sm text-slate-600"><strong>فصيلة الدم المسجلة:</strong> <span className="text-red-600 font-bold" dir="ltr">{appointment.donor.bloodType?.replace('_', ' ')}</span></p>
          </div>

          <div className="labo-card p-5 bg-blue-50/50 border-blue-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              تفاصيل الموعد
            </h3>
            <p className="text-sm text-slate-600 mb-1"><strong>المركز:</strong> {appointment.center.name}</p>
            <p className="text-sm text-slate-600"><strong>الوقت:</strong> {new Date(appointment.scheduledAt).toLocaleString('ar-SA')}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="labo-card p-6">
            <RecordDonationForm 
              appointmentId={appointment.id}
              donorId={appointment.donor.id}
              centerId={appointment.center.id}
              staffId={session.user.id}
              donorBloodType={appointment.donor.bloodType || "O_POSITIVE"}
              defaultNextDate={defaultNextDate.toISOString().slice(0,10)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
