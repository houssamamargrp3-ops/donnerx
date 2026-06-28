import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppointmentForm from "./AppointmentForm";
import { CalendarDays, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "حجز موعد تبرع",
};

export default async function NewAppointmentPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Only donors can book appointments
  if ((session.user as any).role !== "DONOR") {
    redirect("/dashboard");
  }

  // Get donor info to check eligibility
  const donor = await prisma.donor.findUnique({
    where: { userId: session.user.id },
  });

  if (!donor) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in-up max-w-2xl mx-auto mt-10">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">الملف الطبي غير مكتمل</h2>
        <p className="text-slate-400 mb-6">يجب إكمال ملفك الطبي لتتمكن من حجز موعد تبرع بالدم.</p>
        <a href="/donor/setup" className="btn-primary inline-block">
          أكمل ملفك الآن
        </a>
      </div>
    );
  }

  // Check if they are eligible
  if (donor.eligibilityStatus === "INELIGIBLE") {
    return (
      <div className="glass-card p-8 text-center animate-fade-in-up max-w-2xl mx-auto mt-10">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">غير مؤهل حالياً</h2>
        <p className="text-slate-400 mb-6">
          عذراً، بناءً على بياناتك الطبية، أنت غير مؤهل للتبرع بالدم في الوقت الحالي.
        </p>
        {donor.nextEligibleDate && (
          <p className="text-slate-300 font-bold bg-slate-800 p-4 rounded-xl">
            يمكنك المحاولة مرة أخرى بعد: {new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(donor.nextEligibleDate)}
          </p>
        )}
      </div>
    );
  }

  // Fetch all active blood centers
  const centers = await prisma.bloodCenter.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      capacity: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
             style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 10px 25px rgba(220,38,38,0.4)" }}>
          <CalendarDays className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">حجز موعد تبرع</h1>
          <p className="text-slate-400 text-sm">اختر المركز الطبي والوقت المناسب لك للتبرع.</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <AppointmentForm centers={centers} donorId={donor.id} />
      </div>
    </div>
  );
}
