import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DonorForm from "@/components/donors/DonorForm";

export const metadata = { title: "إضافة متبرع جديد" };

export default function NewDonorPage() {
  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            إضافة متبرع جديد
          </h1>
          <p className="text-slate-500 text-sm mt-1">إنشاء سجل لمتبرع جديد وحساب وصول خاص به</p>
        </div>
        <Link href="/dashboard/donors" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <DonorForm />
    </div>
  );
}
