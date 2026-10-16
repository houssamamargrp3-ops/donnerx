import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Plus, MapPin, Droplet, Clock, CheckCircle, Phone } from "lucide-react";
import Link from "next/link";
import { closeEmergencyRequest } from "@/app/actions/emergency.actions";
import RespondEmergencyButton from "@/components/dashboard/RespondEmergencyButton";
import NotificationPermissionBanner from "@/components/dashboard/NotificationPermissionBanner";

export const metadata = { title: "نداءات الطوارئ | HayatLink" };

export default async function EmergencyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";
  const isDonor = role === "DONOR";

  const formatBloodType = (type: string) =>
    type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");

  // ─── DONOR VIEW ───────────────────────────────────────────────
  if (isDonor) {
    const donor = await prisma.donor.findUnique({ where: { userId: session.user.id } });

    const activeRequests = await prisma.emergencyRequest.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        responses: donor ? { where: { donorId: donor.id } } : false,
      } as any,
    });

    return (
      <div className="space-y-5 mt-4 max-w-2xl mx-auto animate-fade-in-up">

        {/* Notification permission banner */}
        <NotificationPermissionBanner />

        {/* Page header */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #0f172a, #1a0505)",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 4px 24px rgba(239,68,68,0.12)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-black uppercase tracking-widest">مباشر</span>
            </div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              نداءات الطوارئ العاجلة
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              {activeRequests.length > 0
                ? `يوجد ${activeRequests.length} نداء طوارئ نشط — دمك ينقذ حياة الآن`
                : "لا توجد نداءات نشطة حالياً — الحمد لله"}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
        </div>

        {/* No donor profile warning */}
        {!donor && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-amber-900 text-sm">ملفك الطبي غير مكتمل</p>
              <p className="text-amber-700 text-xs mt-0.5">أكمل ملفك لتتمكن من تلبية نداءات الطوارئ وإنقاذ الأرواح.</p>
              <a href="/dashboard/setup" className="inline-block mt-2 text-xs font-black text-amber-700 underline">
                أكمل الملف الآن ←
              </a>
            </div>
          </div>
        )}

        {/* Emergency cards */}
        {activeRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 mb-2">الحمد لله — لا يوجد طوارئ</h2>
            <p className="text-slate-400 text-sm">ستظهر هنا أي نداءات فورية وستصلك إشعارات على هاتفك مباشرة.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeRequests.map((req) => {
              const hasResponded = (req as any).responses?.length > 0;
              const diff = Date.now() - new Date(req.createdAt).getTime();
              const mins = Math.floor(diff / 60000);
              const timeAgo = mins < 60
                ? `منذ ${mins} دقيقة`
                : mins < 1440 ? `منذ ${Math.floor(mins / 60)} ساعة`
                : `منذ ${Math.floor(mins / 1440)} يوم`;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(239,68,68,0.2)",
                    boxShadow: "0 4px 20px rgba(239,68,68,0.08)",
                  }}
                >
                  {/* Urgency gradient bar */}
                  <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #dc2626, #ef4444, #f97316)" }} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                            style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}>
                            🚨 طوارئ نشط
                          </span>
                          <span className="text-slate-400 text-[10px]">{timeAgo}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-800">{req.hospitalName}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" /> {req.city}
                        </p>
                      </div>
                      <div
                        className="px-3 py-2 rounded-xl font-black text-xl flex items-center gap-1 flex-shrink-0"
                        style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.2)" }}
                      >
                        <Droplet className="w-4 h-4 fill-current" />
                        {formatBloodType(req.bloodType)}
                      </div>
                    </div>

                    {/* Details */}
                    <div
                      className="p-3 rounded-xl text-sm mb-4 flex items-start gap-2"
                      style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
                    >
                      <Clock className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-slate-700 font-medium">
                          مطلوب <strong className="text-red-600">{req.unitsNeeded} أكياس دم</strong> بشكل عاجل.
                        </p>
                        {req.contactPhone && (
                          <p className="text-slate-500 flex items-center gap-1 text-xs">
                            <Phone className="w-3 h-3" />
                            للتواصل المباشر:{" "}
                            <a
                              href={`tel:${req.contactPhone}`}
                              className="font-black text-blue-600 underline"
                              dir="ltr"
                            >
                              {req.contactPhone}
                            </a>
                          </p>
                        )}
                        {req.contactName && (
                          <p className="text-slate-400 text-xs">مسؤول التواصل: {req.contactName}</p>
                        )}
                      </div>
                    </div>

                    {/* Response button */}
                    {hasResponded ? (
                      <div
                        className="w-full text-center py-3 rounded-xl font-bold text-sm"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#059669", border: "1px solid rgba(16,185,129,0.2)" }}
                      >
                        ✅ لبّيت هذا النداء — أنت بطل حقيقي!
                      </div>
                    ) : (
                      <RespondEmergencyButton
                        requestId={req.id}
                        donorId={donor?.id ?? null}
                        contactPhone={req.contactPhone}
                        hospitalName={req.hospitalName}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── ADMIN / CENTER VIEW ───────────────────────────────────────
  const centerRequests = await prisma.emergencyRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      responses: {
        include: { donor: { include: { user: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            إدارة نداءات الطوارئ
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            متابعة استجابات المتبرعين وإطلاق نداءات عاجلة.
          </p>
        </div>
        <Link href="/dashboard/emergency/new" className="labo-btn-danger flex items-center gap-2">
          <Plus className="w-4 h-4" /> إنشاء نداء طوارئ
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {centerRequests.length === 0 ? (
          <div className="labo-card p-12 text-center text-slate-500">
            <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p>لا يوجد نداءات طوارئ حالياً.</p>
          </div>
        ) : (
          centerRequests.map((req) => (
            <div key={req.id} className="labo-card p-0 overflow-hidden border-t-4 border-t-red-500">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-800">{req.hospitalName}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${req.status === "OPEN" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {req.status === "OPEN" ? "نشط" : "مكتمل"}
                    </span>
                    {req.status === "OPEN" && (
                      <form action={async () => {
                        "use server";
                        await closeEmergencyRequest(req.id);
                      }}>
                        <button type="submit" className="text-xs flex items-center gap-1 bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-50">
                          <CheckCircle className="w-3 h-3" /> إغلاق النداء
                        </button>
                      </form>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mt-1">
                    {req.unitsNeeded} أكياس | {formatBloodType(req.bloodType)} | {req.city}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-800">{req.responses.length}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">متبرع قادم</p>
                </div>
              </div>
              <div>
                {req.responses.length > 0 ? (
                  <table className="labo-table w-full">
                    <thead>
                      <tr>
                        <th>المتبرع</th>
                        <th>الفصيلة</th>
                        <th>وقت الاستجابة</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {req.responses.map((res) => (
                        <tr key={res.id}>
                          <td className="font-bold text-slate-800">{res.donor.user?.name}</td>
                          <td><span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">{formatBloodType(res.donor.bloodType)}</span></td>
                          <td dir="ltr" className="text-right text-slate-600">
                            {new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit" }).format(res.respondedAt)}
                          </td>
                          <td><span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold">{res.status === "PENDING" ? "في الطريق" : res.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-sm">بانتظار استجابة المتبرعين...</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
