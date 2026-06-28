import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Droplet, Award, FileCheck2, Calendar, MapPin, Printer, Activity } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "سجل التبرعات والشهادات",
};

export default async function DonationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";

  if (role === "DONOR") {
    const donor = await prisma.donor.findUnique({
      where: { userId: session.user.id },
      include: {
        donations: {
          include: { center: true },
          orderBy: { donatedAt: "desc" },
        }
      }
    });

    if (!donor) redirect("/dashboard/setup");

    const { donations } = donor;

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Droplet className="w-6 h-6 text-red-500" />
              سجل التبرعات
            </h1>
            <p className="text-slate-400 text-sm mt-1">عرض جميع تبرعاتك السابقة وشهادات الشكر الخاصة بك.</p>
          </div>
          <Link href="/dashboard/appointments/new" className="btn-primary">
            تبرع مرة أخرى
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Droplet className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-6">لم تقم بأي عملية تبرع بعد.</p>
            <Link href="/dashboard/appointments/new" className="btn-primary inline-block">
              ابدأ رحلتك الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation, idx) => (
              <div key={donation.id} className="stats-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500">
                    <Droplet className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                      مكتمل
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(donation.donatedAt)}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    {donation.center.name}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Activity className="w-4 h-4" />
                    الكمية: {donation.volumeMl} مل
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button className="w-full py-2.5 rounded-lg border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    عرض شهادة الشكر
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // MEDICAL CENTER VIEW
  const center = await prisma.bloodCenter.findFirst();
  if (!center) return <div>المركز غير موجود</div>;

  const donations = await prisma.donation.findMany({
    where: { centerId: center.id },
    include: { donor: { include: { user: true } } },
    orderBy: { donatedAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            سجل التبرعات
          </h1>
          <p className="text-slate-400 text-sm mt-1">تاريخ عمليات التبرع الناجحة بالمركز</p>
        </div>
        <Link href="/dashboard/donations/new" className="btn-primary">
          تسجيل تبرع جديد
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">المتبرع</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">التاريخ</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">الكمية (مل)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">الشهادة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    لا يوجد سجلات للتبرع حتى الآن.
                  </td>
                </tr>
              ) : (
                donations.map(don => (
                  <tr key={don.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{don.donor.user.name}</div>
                      <div className="text-sm text-slate-400">فصيلة: {don.donor.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(don.donatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">{don.volumeMl}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-300 hover:text-white flex items-center gap-2 p-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">
                        <Printer className="w-4 h-4" />
                        طباعة
                      </button>
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
