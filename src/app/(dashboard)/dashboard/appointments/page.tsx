import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, CheckCircle2, Clock, XCircle, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "نظام المواعيد",
};

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";

  if (role === "DONOR") {
    // DONOR APPOINTMENTS VIEW
    const donor = await prisma.donor.findUnique({
      where: { userId: session.user.id },
    });

    if (!donor) redirect("/donor/setup");

    const appointments = await prisma.appointment.findMany({
      where: { donorId: donor.id },
      include: { center: true },
      orderBy: { scheduledAt: "desc" },
    });

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-red-400" />
              سجل المواعيد
            </h1>
            <p className="text-slate-400 text-sm mt-1">قائمة بجميع مواعيد التبرع السابقة والقادمة</p>
          </div>
          <Link href="/dashboard/appointments/new" className="btn-primary">
            حجز موعد جديد
          </Link>
        </div>

        <div className="glass-card overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarDays className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">لا توجد مواعيد مسجلة حتى الآن.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {appointments.map(apt => (
                <div key={apt.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                  <div>
                    <h3 className="text-lg font-bold text-white">{apt.center.name}</h3>
                    <p className="text-slate-400 text-sm">{apt.center.address}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(apt.scheduledAt)}
                      </p>
                      <p className="text-slate-400 text-sm">
                        الساعة {new Intl.DateTimeFormat("ar-SA", { timeStyle: "short" }).format(apt.scheduledAt)}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1
                      ${apt.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                        apt.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : 
                        apt.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                        "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
                    >
                      {apt.status === "CONFIRMED" ? <CheckCircle2 className="w-3 h-3" /> : 
                       apt.status === "PENDING" ? <Clock className="w-3 h-3" /> : 
                       apt.status === "CANCELLED" ? <XCircle className="w-3 h-3" /> : 
                       <CheckCircle2 className="w-3 h-3" />}
                      {apt.status === "CONFIRMED" ? "مؤكد" : 
                       apt.status === "PENDING" ? "قيد الانتظار" : 
                       apt.status === "CANCELLED" ? "ملغي" : 
                       apt.status === "COMPLETED" ? "مكتمل" : "مفقود"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // MEDICAL CENTER APPOINTMENTS VIEW
  const center = await prisma.bloodCenter.findFirst(); // For now, grab the first center for this demo. In reality, linked to user.
  
  if (!center) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in-up">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">المركز غير موجود</h2>
      </div>
    );
  }

  const appointments = await prisma.appointment.findMany({
    where: { centerId: center.id },
    include: { donor: { include: { user: true } } },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            إدارة المواعيد
          </h1>
          <p className="text-slate-400 text-sm mt-1">جدول مواعيد المتبرعين لمركز: {center.name}</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="البحث برقم الهاتف أو الاسم..." 
            className="form-input pr-10 py-2 w-64"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">المتبرع</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">فصيلة الدم</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">التاريخ والوقت</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">الحالة</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    لا يوجد مواعيد مسجلة اليوم.
                  </td>
                </tr>
              ) : (
                appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{apt.donor.user.name}</div>
                      <div className="text-sm text-slate-400">{apt.donor.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-400 font-bold text-xs border border-red-500/20">
                        {apt.donor.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(apt.scheduledAt)}
                      </div>
                      <div className="text-sm text-slate-400">
                        {new Intl.DateTimeFormat("ar-SA", { timeStyle: "short" }).format(apt.scheduledAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border
                        ${apt.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                          apt.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : 
                          apt.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                          "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
                      >
                        {apt.status === "CONFIRMED" ? "مؤكد" : 
                         apt.status === "PENDING" ? "قيد الانتظار" : 
                         apt.status === "CANCELLED" ? "ملغي" : "مكتمل"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {apt.status === "CONFIRMED" && (
                        <button className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors">
                          تسجيل الحضور
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
