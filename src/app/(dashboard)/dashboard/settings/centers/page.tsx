import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Building2, MapPin, Activity, CheckCircle2, XCircle } from "lucide-react";
import AddCenterForm from "./AddCenterForm";

export const metadata = { title: "إدارة المراكز الطبية" };

export default async function CentersManagementPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  const centers = await prisma.bloodCenter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            إدارة المراكز الطبية
          </h1>
          <p className="text-slate-500 text-sm mt-1">أضف وتحكم في المستشفيات ومراكز التبرع في النظام.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="labo-card p-6 sticky top-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              إضافة مركز جديد
            </h2>
            <AddCenterForm />
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          {centers.length === 0 ? (
            <div className="labo-card p-12 text-center text-slate-400">
              <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p>لا توجد مراكز طبية مسجلة بعد.</p>
            </div>
          ) : (
            centers.map(center => (
              <div key={center.id} className="labo-card p-0 overflow-hidden flex flex-col sm:flex-row">
                <div className={`w-2 ${center.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 text-lg">{center.name}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1
                        ${center.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {center.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {center.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                      <MapPin className="w-4 h-4 text-slate-400" /> {center.city} — {center.address}
                    </p>
                    
                    <div className="flex gap-4 mt-4 text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg inline-flex">
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-blue-500" />
                        السعة اليومية: {center.capacity} متبرع
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
