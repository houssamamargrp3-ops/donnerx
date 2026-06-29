import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Award, ArrowLeft, Download, ShieldCheck, HeartPulse } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "شهاداتي" };

export default async function DonorCertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const donor = await prisma.donor.findUnique({
    where: { userId: session.user.id },
    include: {
      certificates: {
        include: {
          donation: {
            include: { center: true }
          }
        },
        orderBy: { issuedAt: "desc" }
      }
    }
  });

  if (!donor) {
    return (
      <div className="labo-card p-12 text-center text-slate-500 max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">الملف الطبي غير مكتمل</h2>
        <p>الرجاء إكمال ملفك الطبي أولاً لعرض شهاداتك.</p>
        <Link href="/dashboard/setup" className="labo-btn-primary mt-4 inline-block">
          إكمال الملف الطبي
        </Link>
      </div>
    );
  }

  const certificates = donor.certificates || [];

  return (
    <div className="space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            سجل الشهادات
          </h1>
          <p className="text-slate-500 text-sm mt-1">عرض وتحميل جميع شهادات التبرع الخاصة بك.</p>
        </div>
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {certificates.length === 0 ? (
        <div className="labo-card p-12 text-center bg-slate-50 border-dashed border-2">
          <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">لا توجد شهادات حالياً</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            يتم إصدار الشهادات تلقائياً بعد كل عملية تبرع ناجحة بالدم. بادر بالتبرع لإنقاذ حياة وللحصول على أول شهادة لك!
          </p>
          <Link href="/dashboard/appointments/new" className="labo-btn-primary mt-6 inline-block">
            حجز موعد تبرع
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="labo-card p-0 overflow-hidden group hover:shadow-lg transition-all border-t-4 border-t-[#D4AF37]">
              <div className="p-6">
                <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-4 border border-yellow-100 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">شهادة شكر وتقدير</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                  شهادة ممنوحة لقاء تبرعك في {cert.donation.center.name}.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span>رقم الشهادة:</span>
                    <span className="font-mono font-bold">{cert.serialNumber}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>تاريخ الإصدار:</span>
                    <span className="font-bold">{new Intl.DateTimeFormat('ar-SA').format(cert.issuedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الكمية والفصيلة:</span>
                    <span className="font-bold text-red-600 flex items-center gap-1" dir="ltr">
                      {cert.donation.bloodType.replace('_', ' ')} <HeartPulse className="w-3 h-3"/>
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-3">
                <Link href={`/dashboard/donations/${cert.donation.id}/certificate`} className="labo-btn-primary w-full justify-center text-sm py-2">
                  <Download className="w-4 h-4" /> عرض وتحميل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
