import { Users, Plus, Search, Filter, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { bloodTypeLabel } from "@/lib/utils";

export const metadata = { title: "إدارة المتبرعين" };

export default async function DonorsPage() {
  const donors = await prisma.donor.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  }).catch(() => []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-red-400" />
            إدارة المتبرعين
          </h1>
          <p className="text-slate-400 text-sm mt-1">{donors.length} متبرع مسجّل</p>
        </div>
        <Link
          href="/dashboard/donors/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 4px 15px rgba(220,38,38,0.3)" }}
        >
          <Plus className="w-4 h-4" />
          إضافة متبرع
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="البحث عن متبرع..."
            className="form-input pr-10"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 text-sm"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e3a" }}>
          <Filter className="w-4 h-4" />
          فلتر
        </button>
      </div>

      {/* Table */}
      <div className="stats-card overflow-hidden">
        {donors.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">لا يوجد متبرعون بعد</p>
            <p className="text-slate-600 text-sm mt-2">ابدأ بإضافة أول متبرع</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e3a" }}>
                  {["الاسم", "فصيلة الدم", "الجنس", "الهاتف", "آخر تبرع", "الحالة", ""].map((h) => (
                    <th key={h} className="text-right px-4 py-3 text-xs text-slate-500 font-semibold uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donors.map((donor) => (
                  <tr
                    key={donor.id}
                    className="transition-colors hover:bg-white/2"
                    style={{ borderBottom: "1px solid #1e1e3a" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}
                        >
                          {donor.user.name[0]}
                        </div>
                        <div>
                          <p className="text-slate-200 text-sm font-medium">{donor.user.name}</p>
                          <p className="text-slate-500 text-xs">{donor.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}
                      >
                        {bloodTypeLabel(donor.bloodType)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">
                      {donor.gender === "MALE" ? "ذكر" : "أنثى"}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm" style={{ direction: "ltr" }}>
                      {donor.phone}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {donor.lastDonationDate
                        ? new Intl.DateTimeFormat("ar-SA").format(new Date(donor.lastDonationDate))
                        : "لم يتبرع بعد"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background:
                            donor.eligibilityStatus === "ELIGIBLE"
                              ? "rgba(16,185,129,0.12)"
                              : donor.eligibilityStatus === "INELIGIBLE"
                              ? "rgba(220,38,38,0.12)"
                              : "rgba(245,158,11,0.12)",
                          color:
                            donor.eligibilityStatus === "ELIGIBLE"
                              ? "#34d399"
                              : donor.eligibilityStatus === "INELIGIBLE"
                              ? "#f87171"
                              : "#fbbf24",
                        }}
                      >
                        {donor.eligibilityStatus === "ELIGIBLE"
                          ? "مؤهل"
                          : donor.eligibilityStatus === "INELIGIBLE"
                          ? "غير مؤهل"
                          : "قيد الفحص"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/donors/${donor.id}`}
                        className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-sm transition-colors"
                      >
                        عرض <ChevronLeft className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
