import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewDonationForm from "./NewDonationForm";
import { Droplet, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "تسجيل عملية تبرع",
};

export default async function NewDonationPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Only Center or Admin can record donations
  const role = (session.user as any).role;
  if (role !== "CENTER_STAFF" && role !== "SUPER_ADMIN") {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto mt-10">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">غير مصرح لك</h2>
        <p className="text-slate-400 mb-6">هذه الصفحة مخصصة لموظفي مراكز سحب الدم فقط.</p>
        <a href="/dashboard" className="btn-primary inline-block">العودة للرئيسية</a>
      </div>
    );
  }

  // Get center id for this user. For now, assume first center
  const center = await prisma.bloodCenter.findFirst();
  
  if (!center) {
    return <div>المركز غير موجود</div>;
  }

  // Get all donors who have confirmed appointments today at this center
  const appointments = await prisma.appointment.findMany({
    where: { 
      centerId: center.id,
      status: "CONFIRMED",
      scheduledAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    },
    include: {
      donor: { include: { user: true } }
    }
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
             style={{ background: "linear-gradient(135deg, #10b981, #047857)", boxShadow: "0 10px 25px rgba(16,185,129,0.4)" }}>
          <Droplet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">تسجيل عملية تبرع (Task 5)</h1>
          <p className="text-slate-400 text-sm">أدخل بيانات المتبرع ونتائج الفحص الحيوي بعد عملية سحب الدم.</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <NewDonationForm appointments={appointments} centerId={center.id} />
      </div>
    </div>
  );
}
