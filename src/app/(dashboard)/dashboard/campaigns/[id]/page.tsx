import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Megaphone, CalendarDays, MapPin, Users, Building, ArrowLeft, Clock, Info } from "lucide-react";
import Link from "next/link";
import RegisterCampaignButton from "@/components/dashboard/RegisterCampaignButton";

export const metadata = { title: "تفاصيل الحملة" };

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  const role = session?.user ? (session.user as any).role : "DONOR";

  const campaign = await prisma.campaign.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!campaign) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">نشطة حالياً</span>;
      case "PUBLISHED": return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold border border-blue-200">مجدولة</span>;
      case "COMPLETED": return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-bold border border-slate-200">منتهية</span>;
      default: return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-bold border border-slate-200">{status}</span>;
    }
  };

  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  
  const formatDate = (date: Date) => date.toLocaleDateString('ar-SA');
  const formatTime = (date: Date) => date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="labo-page-title flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">تفاصيل الحملة</h1>
        </div>
        <Link href="/dashboard/campaigns" className="labo-btn-outline flex items-center gap-2">
          العودة للقائمة <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="labo-card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black mb-2">{campaign.name}</h2>
              <div className="flex items-center gap-2 text-blue-100">
                <Building className="w-4 h-4" /> المنظم: {campaign.organizer}
              </div>
            </div>
            <div>
              {getStatusBadge(campaign.status)}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500"/>
                المعلومات الأساسية
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-bold mb-1">المكان والمدينة</div>
                    <div className="text-slate-800 font-medium">{campaign.city}</div>
                    <div className="text-slate-600 text-sm mt-1">{campaign.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-bold mb-1">تاريخ الحملة</div>
                    <div className="text-slate-800 font-medium">من: {formatDate(startDate)}</div>
                    <div className="text-slate-800 font-medium mt-1">إلى: {formatDate(endDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-bold mb-1">الوقت المجدول</div>
                    <div className="text-slate-800 font-medium">يبدأ: {formatTime(startDate)}</div>
                    <div className="text-slate-800 font-medium mt-1">ينتهي: {formatTime(endDate)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500"/>
                السعة والتسجيل
              </h3>
              
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-slate-600 font-bold">المسجلين حالياً</div>
                  <div className="text-2xl font-black text-blue-600">{campaign.registered}</div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="text-slate-600 font-bold">السعة القصوى</div>
                  <div className="text-lg font-bold text-slate-800">{campaign.capacity} متبرع</div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3 mt-4 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${Math.min((campaign.registered / campaign.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-slate-500 mt-3 text-center">
                  نسبة الإشغال: {Math.round((campaign.registered / campaign.capacity) * 100)}%
                </p>
              </div>

              {campaign.description && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">وصف إضافي:</h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-lg border border-slate-100">
                    {campaign.description}
                  </p>
                </div>
              )}
              
              {role === "DONOR" && campaign.status !== "COMPLETED" && (
                <RegisterCampaignButton campaignId={campaign.id} />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
