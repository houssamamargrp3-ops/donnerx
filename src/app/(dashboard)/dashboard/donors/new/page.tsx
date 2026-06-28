import { Users, ChevronLeft } from "lucide-react";
import Link from "next/link";
import DonorForm from "@/components/donors/DonorForm";

export const metadata = { title: "إضافة متبرع جديد" };

export default function NewDonorPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/donors"
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-red-400" />
              إضافة متبرع جديد
            </h1>
            <p className="text-slate-400 text-sm mt-1">إنشاء سجل لمتبرع جديد وحساب وصول خاص به</p>
          </div>
        </div>
      </div>

      <DonorForm />
    </div>
  );
}
