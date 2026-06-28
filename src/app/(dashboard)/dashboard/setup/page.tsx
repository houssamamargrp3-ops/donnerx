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
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up mt-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-red-100 border border-red-200">
          <HeartPulse className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">إكمال الملف الطبي</h1>
        <p className="text-slate-500">
          للبدء في إنقاذ الأرواح كمتبرع، نحتاج لبعض المعلومات الطبية الأساسية.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <DonorSetupForm userId={session.user.id!} />
      </div>
    </div>
  );
}
