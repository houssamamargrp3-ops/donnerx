import { Users, Plus, Search, Filter, ArrowLeft, HeartPulse, Droplet, ShieldCheck, Mail, Phone, CalendarDays } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { bloodTypeLabel } from "@/lib/utils";

export const dynamic = 'force-dynamic';
export const metadata = { title: "إدارة المتبرعين" };

export default async function DonorsPage() {
  const donors = await prisma.donor.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  }).catch(() => []);

  const getEligibilityBadge = (status: string) => {
    switch (status) {
      case "ELIGIBLE": return <span className="labo-badge-success flex items-center gap-1 w-fit"><ShieldCheck className="w-3 h-3" /> مؤهل</span>;
      case "PENDING_CHECK": return <span className="labo-badge-warning flex items-center gap-1 w-fit"><CalendarDays className="w-3 h-3" /> بانتظار الفحص</span>;
      case "INELIGIBLE": return <span className="labo-badge-danger flex items-center gap-1 w-fit"><HeartPulse className="w-3 h-3" /> غير مؤهل</span>;
      default: return <span className="labo-badge-warning">غير محدد</span>;
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            إدارة المتبرعين
          </h1>
          <p className="text-slate-500 text-sm mt-1">{donors.length} متبرع مسجّل في قاعدة البيانات</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
            العودة <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/donors/new" className="labo-btn-primary">
            <Plus className="w-4 h-4" />
            إضافة متبرع
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="البحث عن متبرع بالاسم أو البريد..."
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg py-2.5 pr-10 pl-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-slate-600 font-bold bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors text-sm">
          <Filter className="w-4 h-4" />
          فلتر
        </button>
      </div>

      {/* Donors Table */}
      <div className="labo-card overflow-hidden p-0">
        <div className="labo-table-wrapper">
          <table className="labo-table w-full">
            <thead>
              <tr>
                <th>المتبرع</th>
                <th>فصيلة الدم</th>
                <th>التواصل</th>
                <th>حالة الأهلية</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {donors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    لا يوجد متبرعين مسجلين حالياً.
                  </td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr key={donor.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                          {donor.user.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{donor.user.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {donor.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="bg-red-50 text-red-600 font-bold px-3 py-1.5 rounded-lg text-sm border border-red-100 flex items-center gap-1 w-fit">
                        <Droplet className="w-4 h-4" />
                        {bloodTypeLabel(donor.bloodType)}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-slate-700" dir="ltr">
                        {donor.phone || "غير متوفر"}
                      </div>
                    </td>
                    <td>
                      {getEligibilityBadge(donor.eligibilityStatus)}
                    </td>
                    <td>
                      <Link 
                        href={`/dashboard/donors/${donor.id}`} 
                        className="px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                      >
                        عرض الملف
                      </Link>
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
