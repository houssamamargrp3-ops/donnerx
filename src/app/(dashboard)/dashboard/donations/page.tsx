import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Droplet, MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "سجل التبرعات" };

export default async function DonationsHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const donor = await prisma.donor.findUnique({
    where: { userId: session.user.id },
    include: {
      donations: {
        orderBy: { donatedAt: "desc" },
        include: {
          center: true
        }
      }
    }
  });

  if (!donor) {
    return (
      <div className="labo-card p-12 text-center text-slate-500 max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">الملف الطبي غير مكتمل</h2>
        <p>الرجاء إكمال ملفك الطبي أولاً لعرض سجل تبرعاتك.</p>
        <Link href="/dashboard/setup" className="labo-btn-primary mt-4 inline-block">
          إكمال الملف الطبي
        </Link>
      </div>
    );
  }

  const donations = donor.donations || [];

  return (
    <div className="space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
            سجل التبرعات
          </h1>
          <p className="text-slate-500 text-sm mt-1">تتبع مساهماتك في إنقاذ الأرواح وتفاصيل زياراتك السابقة.</p>
        </div>
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary Stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="labo-stat-card border-l-4 border-l-red-500">
          <div className="labo-stat-icon bg-red-50 text-red-600">
            <Droplet className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">إجمالي التبرعات</p>
            <h2 className="text-2xl font-black text-slate-800">{donor.totalDonations}</h2>
          </div>
        </div>
      </div>

      <div className="labo-card overflow-hidden p-0">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-base font-bold text-slate-800">تفاصيل الزيارات السابقة</h3>
        </div>

        <div className="labo-table-wrapper">
          {donations.length > 0 ? (
            <table className="labo-table w-full">
              <thead>
                <tr>
                  <th>رقم الزيارة</th>
                  <th>تاريخ التبرع</th>
                  <th>المركز / المستشفى</th>
                  <th>الكمية المستخلصة</th>
                  <th>النقاط المكتسبة</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, index) => (
                  <tr key={donation.id}>
                    <td className="font-bold text-slate-800">#{donations.length - index}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-700" dir="ltr">
                          {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(donation.donatedAt)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-700">{donation.center?.name || "مركز غير معروف"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="bg-red-50 text-red-700 font-bold px-2 py-1 rounded text-xs border border-red-100">
                        {donation.volumeMl} مل
                      </span>
                    </td>
                    <td>
                      <span className="bg-yellow-50 text-yellow-700 font-bold px-2 py-1 rounded text-xs border border-yellow-200 flex items-center gap-1 w-fit">
                        +100 نجمة
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>لم تقم بأي تبرع حتى الآن. بادر بحجز موعد لإنقاذ حياة!</p>
              <Link href="/dashboard/appointments/new" className="text-blue-600 font-bold hover:underline mt-2 block">
                حجز موعد جديد
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
