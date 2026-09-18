import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RecordDonationForm from "./RecordDonationForm";
import { Droplet, Calendar, User, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "تسجيل عملية تبرع جديدة | HayatLink" };

export default async function NewDonationPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const resolvedParams = await searchParams;
  const appointmentId = resolvedParams.appointmentId;

  let appointment = null;
  if (appointmentId) {
    appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        donor: { include: { user: true } },
        center: true,
      },
    });
  }

  // Fetch centers and donors for selection if not prefilled by appointment
  const centers = await prisma.bloodCenter.findMany({
    where: { isActive: true },
    select: { id: true, name: true, city: true },
    orderBy: { name: "asc" },
  });

  const donors = await prisma.donor.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const formattedDonors = donors.map((d) => ({
    id: d.id,
    name: d.user?.name || "متبرع",
    phone: d.phone || "",
    bloodType: d.bloodType,
  }));

  // Calculate default next eligible date (3 months = 90 days)
  const defaultNextDate = new Date();
  defaultNextDate.setDate(defaultNextDate.getDate() + 90);

  return (
    <div className="space-y-6 mt-2 max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
            تسجيل وتوثيق عملية تبرع بالدم
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            توثيق سحب كيس الدم، إصدار الشهادة الرسمية، وتحديث نقاط ورتبة المتبرع والمخزون فوراً.
          </p>
        </div>

        <Link
          href="/dashboard/donations"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <span>سجل التبرعات</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Column if Appointment is linked */}
        {appointment ? (
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-red-600" />
                بيانات المتبرع المسجل
              </h3>
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-700">
                  <strong className="text-slate-500">الاسم:</strong> {appointment.donor.user?.name || "متبرع"}
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-500">رقم الهاتف:</strong>{" "}
                  <span dir="ltr">{appointment.donor.phone}</span>
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-500">فصيلة الدم:</strong>{" "}
                  <span className="text-red-600 font-black" dir="ltr">
                    {appointment.donor.bloodType?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                المركز الطبي والموعد
              </h3>
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-700">
                  <strong className="text-slate-500">المركز:</strong> {appointment.center.name}
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-500">المدينة:</strong> {appointment.center.city}
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-500">توقيت الحجز:</strong>{" "}
                  {new Date(appointment.scheduledAt).toLocaleString("ar-SA")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-5 border border-red-200/60 shadow-xs">
              <h3 className="font-black text-red-950 text-sm flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-red-600" />
                تسجيل مباشر (Walk-in)
              </h3>
              <p className="text-xs text-red-900/80 leading-relaxed font-medium">
                يمكنك تسجيل أي عملية تبرع مباشرة عبر اختيار المتبرع والمركز الطبي وتحديد فصيلة الدم والكمية.
              </p>
            </div>
          </div>
        )}

        {/* Main Form Column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <RecordDonationForm
              appointmentId={appointment?.id}
              donorId={appointment?.donor?.id}
              centerId={appointment?.center?.id}
              staffId={session.user.id || ""}
              donorBloodType={appointment?.donor?.bloodType || "O_POSITIVE"}
              defaultNextDate={defaultNextDate.toISOString().slice(0, 10)}
              donors={formattedDonors}
              centers={centers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

