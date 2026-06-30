import { Activity, Users, AlertTriangle, FileText, CheckCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ConfirmDonationButton from "./ConfirmDonationButton";

export default async function MedicalDashboard() {
  // Fetch statistics
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

  // Emergency requests (Real data)
  const activeEmergenciesCount = await prisma.emergencyRequest.count({
    where: { status: "OPEN" }
  });

  const latestEmergencies = await prisma.emergencyRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  // Fetch upcoming appointments
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
      <div className="labo-page-title">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
               style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)", boxShadow: "0 10px 25px rgba(37,99,235,0.4)" }}>
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">لوحة تحكم المركز الطبي</h1>
            <p className="text-slate-500 text-sm mt-1">إدارة المتبرعين، المواعيد، وطلبات الدم العاجلة.</p>
          </div>
        </div>
        <Link href="/dashboard/emergency">
          <button className="labo-btn-danger">
            <ShieldAlert className="w-4 h-4" />
            نداء طوارئ جديد
          </button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="labo-stat-card">
          <div className="labo-stat-icon bg-blue-100 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">إجمالي المتبرعين</p>
            <h2 className="text-2xl font-black text-slate-800">{totalDonors.toLocaleString()}</h2>
          </div>
        </div>

        <div className="labo-stat-card">
          <div className="labo-stat-icon bg-green-100 text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">تبرعات اليوم</p>
            <h2 className="text-2xl font-black text-slate-800">{todaysDonations}</h2>
          </div>
        </div>

        <div className="labo-stat-card">
          <div className="labo-stat-icon bg-orange-100 text-orange-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">مواعيد بانتظار التأكيد</p>
            <h2 className="text-2xl font-black text-slate-800">{pendingAppointments}</h2>
          </div>
        </div>

        <div className="labo-stat-card border-t-4 border-t-red-500">
          <div className="labo-stat-icon bg-red-100 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">طلبات طوارئ نشطة</p>
            <h2 className="text-2xl font-black text-slate-800">{activeEmergenciesCount}</h2>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Emergency Requests Table (Static for now) */}
        <div className="labo-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              أحدث الطلبات العاجلة
            </h3>
            <Link href="/dashboard/emergency" className="text-xs text-blue-600 hover:underline font-bold">الكل</Link>
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
                        <Link href="/dashboard/emergency" className="labo-action-btn labo-action-edit">عرض</Link>
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
            <h3 className="text-base font-bold text-slate-800">المواعيد القادمة</h3>
            <Link href="/dashboard/appointments" className="text-xs text-blue-600 hover:underline font-bold">الكل</Link>
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
