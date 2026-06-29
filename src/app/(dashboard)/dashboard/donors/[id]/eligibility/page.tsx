import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import EligibilityForm from "@/components/eligibility/EligibilityForm";

export const metadata = { title: "فحص أهلية المتبرع" };

export default async function EligibilityCheckPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const donor = await prisma.donor.findUnique({
    where: { id: resolvedParams.id },
    include: { user: true }
  });

  if (!donor) notFound();

  const age = donor.dateOfBirth ? Math.floor((new Date().getTime() - new Date(donor.dateOfBirth).getTime()) / 3.15576e+10) : 0;

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            فحص أهلية التبرع
          </h1>
          <p className="text-slate-500 text-sm mt-1">التقييم الطبي للمتبرع: {donor.user?.name} قبل عملية سحب الدم</p>
        </div>
        <Link href={`/dashboard/donors/${resolvedParams.id}`} className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة للملف <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <EligibilityForm 
        donorId={donor.id} 
        initialAge={age} 
        initialWeight={donor.weight} 
        gender={donor.gender} 
      />
    </div>
  );
}
