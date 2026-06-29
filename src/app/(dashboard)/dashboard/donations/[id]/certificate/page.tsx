import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Award, Printer, ChevronRight } from "lucide-react";
import Link from "next/link";
import ClientPrintButton from "./ClientPrintButton";

export const metadata = { title: "شهادة شكر وتقدير" };

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const donation = await prisma.donation.findUnique({
    where: { id: params.id },
    include: {
      donor: { include: { user: true } },
      center: true,
      certificate: true,
    }
  });

  if (!donation || !donation.certificate) {
    return <div className="p-8 text-center text-red-500">الشهادة غير متوفرة.</div>;
  }

  return (
    <div className="space-y-6 mt-4 max-w-5xl mx-auto">
      {/* Top Actions */}
      <div className="flex justify-between items-center no-print">
        <Link href="/dashboard/donations" className="text-slate-500 hover:text-red-600 font-bold flex items-center gap-1 transition-colors">
          <ChevronRight className="w-5 h-5" />
          العودة لسجل التبرعات
        </Link>
        <ClientPrintButton />
      </div>

      {/* The Certificate Wrapper (Printed Area) */}
      <div id="certificate-area" className="relative w-full aspect-[1.414] max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden rounded-lg print:shadow-none print:rounded-none">
        
        {/* Decorative Borders */}
        <div className="absolute inset-0 border-[12px] border-[#D4AF37] m-4 pointer-events-none opacity-80" style={{ borderStyle: 'double' }}></div>
        <div className="absolute inset-0 border-2 border-[#D4AF37] m-6 pointer-events-none opacity-50"></div>
        
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-96 h-96 text-red-900" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-16 flex flex-col items-center text-center h-full justify-between">
          
          {/* Header */}
          <div className="space-y-4 w-full">
            <h3 className="text-xl font-bold tracking-widest text-slate-400 uppercase" dir="ltr">DONNER.X Platform</h3>
            <div className="w-32 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
            <h1 className="text-6xl font-black text-slate-800 mt-6" style={{ fontFamily: 'var(--font-cairo), sans-serif' }}>
              شهادة شكر وتقدير
            </h1>
            <p className="text-2xl text-slate-600 font-medium">Certificate of Appreciation</p>
          </div>

          {/* Body */}
          <div className="space-y-6 w-full max-w-2xl mt-8">
            <p className="text-xl text-slate-600 leading-relaxed">
              تتقدم منصة DONNER.X و <strong className="text-slate-800">{donation.center.name}</strong> بخالص الشكر والامتنان والتقدير إلى
            </p>
            
            <h2 className="text-5xl font-black text-red-700 py-4 border-y-2 border-red-100 bg-red-50/30">
              {donation.donor.user?.name || 'متبرع مجهول'}
            </h2>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              على عطائه النبيل وتبرعه بالدم، مساهماً في إنقاذ حياة الآخرين وإحياء الأمل في نفوسهم. 
              كتب الله أجرك وجعلها في ميزان حسناتك.
            </p>
          </div>

          {/* Footer Info & Signatures */}
          <div className="w-full flex justify-between items-end mt-12 px-8">
            <div className="text-right space-y-1">
              <p className="text-sm font-bold text-slate-500">رقم الشهادة (Serial):</p>
              <p className="font-mono text-slate-800 font-bold" dir="ltr">{donation.certificate.serialNumber}</p>
              <p className="text-sm font-bold text-slate-500 mt-4">تاريخ التبرع:</p>
              <p className="text-slate-800 font-bold">{new Date(donation.donatedAt).toLocaleDateString('ar-SA')}</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-red-50 rounded-full border border-red-100 flex items-center justify-center mx-auto shadow-inner">
                <div className="text-3xl font-black text-red-600" dir="ltr">{donation.bloodType.replace('_', ' ')}</div>
              </div>
              <p className="text-sm font-bold text-red-800 bg-red-100 px-3 py-1 rounded-full">قطرة دم = حياة</p>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-slate-500">الختم والتوقيع</p>
              <div className="w-40 h-16 border-b-2 border-slate-300 mx-auto">
                <img src="/signature-placeholder.png" className="w-full h-full object-contain opacity-50" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <p className="text-sm font-bold text-slate-800">{donation.center.name}</p>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-area, #certificate-area * {
            visibility: visible;
          }
          #certificate-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            margin: 0;
            box-shadow: none;
            page-break-after: avoid;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
}
