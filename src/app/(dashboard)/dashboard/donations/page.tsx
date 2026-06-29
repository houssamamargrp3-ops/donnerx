import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Droplet, Award, Calendar, Search } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "سجل التبرعات" };

export default async function DonationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN" || role === "CENTER_STAFF";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const donations = await prisma.donation.findMany({
    include: {
      donor: { include: { user: true } },
      center: true,
      certificate: true,
    },
    orderBy: { donatedAt: "desc" },
  });

  return (
    <div className="space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplet className="w-6 h-6 text-red-600" />
            سجل التبرعات الناجحة
          </h1>
          <p className="text-slate-500 text-sm mt-1">تتبع وإدارة جميع عمليات التبرع التي تمت في المراكز.</p>
        </div>
      </div>

      <div className="labo-card overflow-hidden p-0">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800">قائمة التبرعات</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو الفصيلة..." 
              className="w-64 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-1.5 pr-9 pl-4 outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        
        <div className="labo-table-wrapper">
          {donations.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Droplet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p>لا توجد تبرعات مسجلة حتى الآن.</p>
            </div>
          ) : (
            <table className="labo-table w-full">
              <thead>
                <tr>
                  <th>المتبرع</th>
                  <th>تاريخ التبرع</th>
                  <th>الكمية والفصيلة</th>
                  <th>الشهادة</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="font-bold text-slate-800">{donation.donor.user?.name}</div>
                      <div className="text-xs text-slate-500">{donation.center.name}</div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-800" dir="ltr">
                        {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(donation.donatedAt)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-50 text-red-700 font-black px-2 py-1 rounded text-xs border border-red-100" dir="ltr">
                          {donation.bloodType.replace('_', ' ')}
                        </span>
                        <span className="text-slate-600 text-sm font-bold">{donation.volumeMl}ml</span>
                      </div>
                    </td>
                    <td>
                      {donation.certificate ? (
                        <Link 
                          href={`/dashboard/donations/${donation.id}/certificate`} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors border border-amber-200"
                        >
                          <Award className="w-4 h-4" />
                          عرض الشهادة
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-xs">لا يوجد شهادة</span>
                      )}
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
