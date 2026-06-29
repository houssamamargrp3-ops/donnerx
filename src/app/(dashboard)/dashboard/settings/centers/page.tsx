import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import AddCenterForm from "./AddCenterForm";
import CenterCard from "./CenterCard";

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
              <CenterCard key={center.id} center={center} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
