import { Users, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import DonorForm from "@/components/donors/DonorForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = { title: "تعديل بيانات المتبرع" };

export default async function EditDonorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const donor = await prisma.donor.findUnique({
    where: { id: resolvedParams.id },
    include: { user: true },
  });

  if (!donor) notFound();

  const initialData = {
    id: donor.id,
    name: donor.user.name || "",
    email: donor.user.email || "",
    phone: donor.phone || "",
    bloodType: donor.bloodType,
    gender: donor.gender,
    dateOfBirth: donor.dateOfBirth.toISOString(),
    weight: donor.weight,
    address: donor.address || "",
    city: donor.city || "",
    chronicDiseases: donor.chronicDiseases.join(", "),
    eligibilityStatus: donor.eligibilityStatus,
    eligibilityReason: donor.eligibilityReason || "",
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            تعديل ملف المتبرع
          </h1>
          <p className="text-slate-500 text-sm mt-1">تحديث البيانات الطبية أو الشخصية للمتبرع: {donor.user.name}</p>
        </div>
        <Link href={`/dashboard/donors/${resolvedParams.id}`} className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة للملف <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <DonorForm initialData={initialData} isEdit={true} />
    </div>
  );
}
