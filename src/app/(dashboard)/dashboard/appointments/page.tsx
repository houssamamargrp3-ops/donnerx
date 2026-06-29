import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, CheckCircle2, Clock, XCircle, Search, AlertTriangle, ArrowLeft } from "lucide-react";
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

    if (!donor) redirect("/dashboard/setup");

    const appointments = await prisma.appointment.findMany({
      where: { donorId: donor.id },
      include: { center: true },
      orderBy: { scheduledAt: "desc" },
    });

    return (
      <div className="space-y-6 mt-4">
        
        <div className="labo-page-title mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-red-600" />
              سجل المواعيد
            </h1>
            <p className="text-slate-500 text-sm mt-1">إدارة ومتابعة جميع مواعيد التبرع القادمة والسابقة.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
              العودة <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/dashboard/appointments/new" className="labo-btn-primary">
              حجز موعد جديد
            </Link>
          </div>
        </div>

        <div className="labo-card overflow-hidden p-0">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="text-base font-bold text-slate-800">قائمة المواعيد</h3>
          </div>
          
          <div className="labo-table-wrapper">
            {appointments.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p>لا توجد مواعيد مسجلة حتى الآن.</p>
                <Link href="/dashboard/appointments/new" className="text-blue-600 font-bold hover:underline mt-2 block">
                  ابدأ بحجز موعدك الأول
                </Link>
              </div>
            ) : (
              <table className="labo-table w-full">
                <thead>
                  <tr>
                    <th>المركز / المستشفى</th>
                    <th>التاريخ والوقت</th>
                    <th>حالة الموعد</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <div className="font-bold text-slate-800">{apt.center.name}</div>
                        <div className="text-xs text-slate-500">{apt.center.address}</div>
                      </td>
                      <td>
                        <div className="font-bold text-slate-800" dir="ltr">
                          {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(apt.scheduledAt)}
                        </div>
                        <div className="text-xs text-slate-500 font-bold">
                          الساعة {new Intl.DateTimeFormat("ar-SA", { timeStyle: "short" }).format(apt.scheduledAt)}
                        </div>
                      </td>
                      <td>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit
                          ${apt.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                            apt.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                            apt.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" : 
                            "bg-blue-50 text-blue-700 border-blue-200"}`}
                        >
                          {apt.status === "CONFIRMED" ? <CheckCircle2 className="w-4 h-4" /> : 
                           apt.status === "PENDING" ? <Clock className="w-4 h-4" /> : 
                           apt.status === "CANCELLED" ? <XCircle className="w-4 h-4" /> : 
                           <CheckCircle2 className="w-4 h-4" />}
                          {apt.status === "CONFIRMED" ? "مؤكد" : 
                           apt.status === "PENDING" ? "قيد الانتظار" : 
                           apt.status === "CANCELLED" ? "ملغي" : 
                           apt.status === "COMPLETED" ? "مكتمل" : "مفقود"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MEDICAL CENTER APPOINTMENTS VIEW
  const center = await prisma.bloodCenter.findFirst(); 
  
  if (!center) {
    return (
      <div className="labo-card p-12 text-center text-slate-500">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">المركز غير موجود</h2>
      </div>
    );
  }

  const appointments = await prisma.appointment.findMany({
    where: { centerId: center.id },
    include: { donor: { include: { user: true } } },
    orderBy: { scheduledAt: "asc" },
  });

  const formatBloodType = (type: string) => type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");

  return (
    <div className="space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            إدارة المواعيد
          </h1>
          <p className="text-slate-500 text-sm mt-1">جدول مواعيد المتبرعين لمركز: {center.name}</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="البحث برقم الهاتف أو الاسم..." 
            className="w-64 bg-white border border-slate-200 text-slate-800 rounded-lg py-2 pr-10 pl-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
          />
        </div>
      </div>

      <div className="labo-card overflow-hidden p-0">
        <div className="labo-table-wrapper">
          <table className="labo-table w-full">
            <thead>
              <tr>
                <th>المتبرع</th>
                <th>فصيلة الدم</th>
                <th>التاريخ والوقت</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    لا يوجد مواعيد مسجلة اليوم.
                  </td>
                </tr>
              ) : (
                appointments.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div className="font-bold text-slate-800">{apt.donor.user?.name || 'متبرع'}</div>
                      <div className="text-xs text-slate-500" dir="ltr">{apt.donor.phone}</div>
                    </td>
                    <td>
                      <span className="bg-red-50 text-red-600 font-bold px-2 py-1 rounded text-xs border border-red-100">
                        {formatBloodType(apt.donor.bloodType)}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-slate-800" dir="ltr">
                        {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(apt.scheduledAt)}
                      </div>
                      <div className="text-xs text-slate-500 font-bold">
                        {new Intl.DateTimeFormat("ar-SA", { timeStyle: "short" }).format(apt.scheduledAt)}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border
                        ${apt.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                          apt.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                          apt.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" : 
                          "bg-blue-50 text-blue-700 border-blue-200"}`}
                      >
                        {apt.status === "CONFIRMED" ? "مؤكد" : 
                         apt.status === "PENDING" ? "قيد الانتظار" : 
                         apt.status === "CANCELLED" ? "ملغي" : "مكتمل"}
                      </span>
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
