import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CalendarDays, Clock, MapPin, QrCode, ArrowLeft, CheckCircle2, AlertTriangle, Phone } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import CancelAppointmentButton from "./CancelAppointmentButton";

export const metadata = { title: "تفاصيل الموعد" };

export default async function AppointmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const appointment = await prisma.appointment.findUnique({
    where: { id: resolvedParams.id },
    include: {
      center: true,
      donor: { include: { user: true } },
    }
  });

  if (!appointment) notFound();

  // Allow only the owner or staff to view
  const role = (session.user as any).role;
  if (role === "DONOR" && appointment.donor.userId !== session.user.id) {
    redirect("/dashboard/appointments");
  }

  const isCancellable = appointment.status === "PENDING" || appointment.status === "CONFIRMED";

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            تفاصيل موعد التبرع
          </h1>
          <p className="text-slate-500 text-sm mt-1">تذكرة الموعد ورمز الدخول الخاص بك.</p>
        </div>
        <Link href="/dashboard/appointments" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Ticket Details */}
        <div className="md:col-span-3 space-y-6">
          <div className="labo-card p-6 relative overflow-hidden">
            {/* Ticket Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-50 rounded-full -ml-12 -mb-12 z-0" />
            
            <div className="relative z-10 space-y-6">
              
              <div className="flex justify-between items-start pb-6 border-b border-slate-100 border-dashed">
                <div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {appointment.status === "CONFIRMED" ? "موعد مؤكد" : appointment.status}
                  </div>
                  <h2 className="text-xl font-black text-slate-800">{appointment.center.name}</h2>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {appointment.center.city} - {appointment.center.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-xs font-bold block mb-1 flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" /> التاريخ
                  </span>
                  <span className="text-slate-800 font-black text-lg block" dir="ltr">
                    {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(appointment.scheduledAt)}
                  </span>
                  <span className="text-slate-500 font-bold text-sm">
                    {new Intl.DateTimeFormat("ar-SA", { weekday: "long" }).format(appointment.scheduledAt)}
                  </span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-xs font-bold block mb-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> الوقت
                  </span>
                  <span className="text-slate-800 font-black text-lg block" dir="ltr">
                    {new Intl.DateTimeFormat("en-GB", { timeStyle: "short" }).format(appointment.scheduledAt)}
                  </span>
                  <span className="text-slate-500 font-bold text-sm">بتوقيت العيادة</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2 text-sm text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p>يرجى الحضور قبل الموعد بـ 10 دقائق وتأكد من شرب كمية كافية من الماء.</p>
              </div>

            </div>
          </div>
          
          {isCancellable && (
            <div className="pt-4">
              <CancelAppointmentButton appointmentId={appointment.id} />
            </div>
          )}
          
          {appointment.status === "CANCELLED" && (
            <div className="labo-card p-6 bg-red-50 border-red-200">
              <h3 className="text-red-800 font-bold text-lg mb-1">تم إلغاء الموعد</h3>
              <p className="text-red-600 text-sm">سبب الإلغاء: {appointment.cancelReason || "غير محدد"}</p>
            </div>
          )}
        </div>

        {/* QR Code Column */}
        <div className="md:col-span-2">
          <div className="labo-card p-6 text-center h-full flex flex-col justify-center items-center">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 justify-center">
              <QrCode className="w-5 h-5 text-slate-500" />
              رمز الدخول (Check-in)
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-[200px] mx-auto">
              قم بإبراز هذا الرمز لموظف الاستقبال عند وصولك للمركز الطبي.
            </p>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 inline-block mb-4">
              {appointment.qrCode ? (
                <QRCodeSVG 
                  value={appointment.qrCode} 
                  size={160} 
                  level="H"
                  fgColor="#0f172a"
                  imageSettings={{
                    src: "/logo.png", 
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              ) : (
                <div className="w-[160px] h-[160px] bg-slate-100 flex items-center justify-center text-slate-400">
                  <QrCode className="w-10 h-10 opacity-50" />
                </div>
              )}
            </div>
            
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              ID: {appointment.id.substring(0, 8)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
