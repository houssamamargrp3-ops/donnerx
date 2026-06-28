import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DonorSetupForm from "./DonorSetupForm";
import { HeartPulse } from "lucide-react";

export const metadata = {
  title: "إعداد الملف الطبي",
};

export default async function DonorSetupPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Check if they already have a donor profile
  const existingDonor = await prisma.donor.findUnique({
    where: { userId: session.user.id },
  });

  // If already setup, redirect to dashboard
  if (existingDonor) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0a0a12" }}>
      <div className="max-w-2xl w-full animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
               style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 10px 25px rgba(220,38,38,0.4)" }}>
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">إكمال الملف الطبي</h1>
          <p className="text-slate-400">
            للبدء في إنقاذ الأرواح كمتبرع، نحتاج لبعض المعلومات الطبية الأساسية.
          </p>
        </div>

        <div className="glass-card p-8">
          <DonorSetupForm userId={session.user.id!} />
        </div>
      </div>
    </div>
  );
}
