import {
  Activity,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle,
  ShieldAlert,
  UserCheck,
  UserX,
  TrendingUp,
  Droplet,
  Truck,
  HeartHandshake
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ConfirmDonationButton from "./ConfirmDonationButton";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

export default async function MedicalDashboard() {
  // ─── 1. Core Counts ───────────────────────────────────────────
  const totalDonors = await prisma.donor.count();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysDonations = await prisma.donation.count({
    where: {
      donatedAt: {
        gte: today,
        lt: tomorrow
      }
    }
  });

  const pendingAppointments = await prisma.appointment.count({
    where: {
      status: "PENDING",
      scheduledAt: {
        gte: today
      }
    }
  });

  // ─── 2. Emergency requests ─────────────────────────────────────
  const activeEmergenciesCount = await prisma.emergencyRequest.count({
    where: { status: "OPEN" }
  });

  const latestEmergencies = await prisma.emergencyRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  // ─── 3. Accepted & Rejected Donor Analytics across ALL channels ─
  // A. Accepted metrics
  const totalDonationsAllTime = await prisma.donation.count();
  const acceptedEmergencyCount = await prisma.emergencyResponse.count({
    where: { status: "CONFIRMED" }
  });
  const completedHomeVisits = await prisma.homeDonationRequest.count({
    where: { status: "COMPLETED" }
  });
  const eligibleDonorsCount = await prisma.donor.count({
    where: { eligibilityStatus: "ELIGIBLE" }
  });

  // B. Rejected metrics (Emergency, Home, Campaign/Clinical checks)
  const rejectedEmergencyCount = await prisma.emergencyResponse.count({
    where: { status: "REJECTED" }
  });
  const cancelledHomeRequests = await prisma.homeDonationRequest.count({
    where: { status: "CANCELLED" }
  });
  const ineligibleDonorsCount = await prisma.donor.count({
    where: { eligibilityStatus: "INELIGIBLE" }
  });
  const failedMedicalChecksCount = await prisma.eligibilityCheck.count({
    where: { isEligible: false }
  });

  // Consolidated Accepted & Rejected totals
  const totalAcceptedCount = totalDonationsAllTime + acceptedEmergencyCount;
  const totalRejectedCount = rejectedEmergencyCount + cancelledHomeRequests + ineligibleDonorsCount;
  const totalEvaluated = totalAcceptedCount + totalRejectedCount;
  const acceptanceRate = totalEvaluated > 0 ? Math.round((totalAcceptedCount / totalEvaluated) * 100) : 100;
  const rejectionRate = 100 - acceptanceRate;

  // ─── 4. Upcoming Appointments ──────────────────────────────────
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      status: "PENDING",
      scheduledAt: { gte: new Date() }
    },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    include: {
      donor: {
        include: { user: true }
      }
    }
  });

  const formatBloodType = (type: string) => {
    return type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title (Labo.dz style) */}
      <div className="labo-page-title flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
               style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)" }}>
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">لوحة تحكم المركز الطبي</h1>
            <p className="text-slate-500 text-sm mt-1">إدارة المتبرعين، متابعة المقبولين والمرفوضين، والمواعيد العاجلة.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!FEATURE_FLAGS.HIDE_QR_SCANNER && (
          <Link href="/dashboard/qr" className="labo-btn-outline flex items-center gap-1.5 text-xs font-bold bg-white px-3.5 py-2 rounded-xl border border-slate-200">
            <span>مسح بطاقة QR 📷</span>
          </Link>
        )}
          <Link href="/dashboard/impact" className="labo-btn-outline flex items-center gap-1.5 text-xs font-bold bg-white px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>قياس الأثر 📈</span>
          </Link>
          <Link href="/dashboard/emergency">
            <button className="labo-btn-danger flex items-center gap-1.5 text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>نداء طوارئ جديد</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ──────────────── 6 Key Stat Cards Grid ──────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Donors */}
        <div className="labo-stat-card p-4">
          <div className="labo-stat-icon bg-blue-100 text-blue-600 mb-2">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-bold uppercase mb-0.5">إجمالي المتبرعين</p>
            <h2 className="text-xl font-black text-slate-800">{totalDonors.toLocaleString()}</h2>
          </div>
        </div>

        {/* Accepted Donors */}
        <div className="labo-stat-card p-4 border-t-4 border-t-emerald-500">
          <div className="labo-stat-icon bg-emerald-100 text-emerald-700 mb-2">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-emerald-700 text-[11px] font-black uppercase mb-0.5">المقبولون (تبرعات ناجحة)</p>
            <h2 className="text-xl font-black text-emerald-600">{totalAcceptedCount.toLocaleString()}</h2>
          </div>
        </div>

        {/* Rejected Donors */}
        <div className="labo-stat-card p-4 border-t-4 border-t-rose-500">
          <div className="labo-stat-icon bg-rose-100 text-rose-700 mb-2">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-rose-700 text-[11px] font-black uppercase mb-0.5">المرفوضون (كل القنوات)</p>
            <h2 className="text-xl font-black text-rose-600">{totalRejectedCount.toLocaleString()}</h2>
          </div>
        </div>

        {/* Today's Donations */}
        <div className="labo-stat-card p-4">
          <div className="labo-stat-icon bg-green-100 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-bold uppercase mb-0.5">تبرعات اليوم</p>
            <h2 className="text-xl font-black text-slate-800">{todaysDonations}</h2>
          </div>
        </div>

        {/* Pending Appointments */}
        <div className="labo-stat-card p-4">
          <div className="labo-stat-icon bg-orange-100 text-orange-600 mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-bold uppercase mb-0.5">مواعيد قادمة</p>
            <h2 className="text-xl font-black text-slate-800">{pendingAppointments}</h2>
          </div>
        </div>

        {/* Active Emergencies */}
        <div className="labo-stat-card p-4 border-t-4 border-t-red-500">
          <div className="labo-stat-icon bg-red-100 text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-bold uppercase mb-0.5">نداءات طوارئ نشطة</p>
            <h2 className="text-xl font-black text-slate-800">{activeEmergenciesCount}</h2>
          </div>
        </div>
      </div>

      {/* ──────────────── ACCEPTED VS. REJECTED DETAILED BREAKDOWN ──────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span>تقرير وإحصائيات المقبولين والمرفوضين (منزلي • نداء عاجل • مراكز وحملات)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              تتبع دقيق وموحد لجميع حالات قبول التبرعات أو الرفض الطبي والتنظيمي عبر جميع أقسام المنصة.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-600">معدل القبول العام:</span>
            <span className="font-mono text-sm font-black text-emerald-600">{acceptanceRate}%</span>
          </div>
        </div>

        {/* Progress Bar of Acceptance vs Rejection */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span className="text-emerald-700">المقبولون: {totalAcceptedCount} ({acceptanceRate}%)</span>
            <span className="text-rose-700">المرفوضون: {totalRejectedCount} ({rejectionRate}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.max(acceptanceRate, 5)}%` }}
              title={`المقبولون: ${acceptanceRate}%`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${Math.max(rejectionRate, 5)}%` }}
              title={`المرفوضون: ${rejectionRate}%`}
            />
          </div>
        </div>

        {/* Side-by-side details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Accepted Breakdown */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>تفاصيل التبرعات والمقبولين:</span>
              </span>
              <span className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                إجمالي: {totalAcceptedCount}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-red-500 fill-current" />
                  <span>تبرعات المراكز الطبية والحملات الميدانية:</span>
                </span>
                <span className="font-mono font-black text-slate-900">{totalDonationsAllTime} كيس</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>المقبولون في نداءات الطوارئ العاجلة:</span>
                </span>
                <span className="font-mono font-black text-slate-900">{acceptedEmergencyCount} متبرع</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>زيارات التبرع المنزلي المكتملة بنجاح:</span>
                </span>
                <span className="font-mono font-black text-slate-900">{completedHomeVisits} زيارة</span>
              </div>
            </div>
          </div>

          {/* Rejected Breakdown */}
          <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-rose-900 flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-rose-600" />
                <span>تفاصيل المرفوضين وغير المؤهلين:</span>
              </span>
              <span className="text-xs font-black text-rose-700 bg-white px-2 py-0.5 rounded-lg border border-rose-200">
                إجمالي: {totalRejectedCount}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-rose-100">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>المرفوضون في النداء العاجل (فحص سريري):</span>
                </span>
                <span className="font-mono font-black text-rose-700">{rejectedEmergencyCount} حالة</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-rose-100">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>طلبات التبرع المنزلي الملغاة / المرفوضة:</span>
                </span>
                <span className="font-mono font-black text-rose-700">{cancelledHomeRequests} طلب</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-rose-100">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
                  <span>غير مؤهلين طبياً (فحوصات الأهلية/الحملات):</span>
                </span>
                <span className="font-mono font-black text-rose-700">{ineligibleDonorsCount} متبرع</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Tables Section ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Emergency Requests Table */}
        <div className="labo-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              أحدث نداءات الطوارئ العاجلة
            </h3>
            <Link href="/dashboard/emergency" className="text-xs text-blue-600 hover:underline font-bold">عرض الكل ←</Link>
          </div>
          
          <div className="labo-table-wrapper">
            <table className="labo-table">
              <thead>
                <tr>
                  <th>المستشفى</th>
                  <th>الفصيلة</th>
                  <th>الكمية</th>
                  <th>الحالة</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {latestEmergencies.length > 0 ? (
                  latestEmergencies.map((req) => (
                    <tr key={req.id}>
                      <td className="font-bold">{req.hospitalName}</td>
                      <td><span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs" dir="ltr">{formatBloodType(req.bloodType)}</span></td>
                      <td>{req.unitsNeeded} أكياس</td>
                      <td><span className="labo-badge-danger">نشط</span></td>
                      <td>
                        <Link href="/dashboard/emergency" className="labo-action-btn labo-action-edit">متابعة المتبرعين</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-slate-500">لا توجد طلبات طوارئ نشطة حالياً.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments Table */}
        <div className="labo-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">المواعيد القادمة في المراكز</h3>
            <Link href="/dashboard/appointments" className="text-xs text-blue-600 hover:underline font-bold">عرض الكل ←</Link>
          </div>
          
          <div className="labo-table-wrapper">
            <table className="labo-table">
              <thead>
                <tr>
                  <th>الوقت</th>
                  <th>الاسم</th>
                  <th>الفصيلة</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td className="font-bold text-slate-800" dir="ltr">
                        {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(appt.scheduledAt)}
                        <br/>
                        <span className="text-[10px] text-slate-400 font-normal">{new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric' }).format(appt.scheduledAt)}</span>
                      </td>
                      <td className="font-bold text-slate-700">{appt.donor.user?.name || 'متبرع'}</td>
                      <td><span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">{formatBloodType(appt.donor.bloodType)}</span></td>
                      <td>
                        <ConfirmDonationButton appointmentId={appt.id} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-slate-500 py-6">
                      لا يوجد مواعيد قادمة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
