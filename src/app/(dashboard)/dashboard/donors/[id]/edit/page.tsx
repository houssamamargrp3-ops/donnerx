import { Users, ChevronLeft } from "lucide-react";
import Link from "next/link";
import DonorForm from "@/components/donors/DonorForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = { title: "تعديل بيانات المتبرع" };

export default async function EditDonorPage({ params }: { params: { id: string } }) {
  const donor = await prisma.donor.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!donor) {
    notFound();
  }

  const initialData = {
    id: donor.id,
    name: donor.user.name || "",
    email: donor.user.email || "",
    phone: donor.phone,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/donors/${donor.id}`}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-red-400" />
              تعديل بيانات المتبرع
            </h1>
            <p className="text-slate-400 text-sm mt-1">{donor.user.name}</p>
          </div>
        </div>
      </div>

      <DonorForm initialData={initialData} isEdit />
    </div>
  );
}
