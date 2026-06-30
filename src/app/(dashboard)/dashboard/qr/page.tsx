import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QrCode } from "lucide-react";
import SmartDonorCard from "@/components/dashboard/SmartDonorCard";

export const metadata = { title: "البطاقة الصحية الذكية | DONNER.X" };

export default async function QRPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";

  // Admin/Staff view
  if (role !== "DONOR") {
    return (
      <div className="space-y-6">
        <div className="labo-page-title">
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">نظام QR والبطاقات الصحية</h1>
          </div>
        </div>
        <div className="labo-card p-12 text-center">
          <QrCode className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">ماسح البطاقات الصحية</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            يمكنك مسح رمز QR الخاص بأي متبرع للتحقق الفوري من هويته، فصيلة دمه، وحالة أهليته للتبرع.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-sm mx-auto">
            <p className="text-blue-700 text-sm font-bold">
              💡 استخدم كاميرا الهاتف أو قارئ QR لمسح بطاقة المتبرع
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Donor view: Smart Card
  return <SmartDonorCard />;
}
