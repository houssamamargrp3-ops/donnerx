import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DonationsClientView from "./DonationsClientView";

export const metadata = { title: "سجل وأرشيف التبرعات | DONNER.X" };

export default async function DonationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const role = user.role || "DONOR";
  const isDonor = role === "DONOR";

  let donations: any[] = [];
  let donorProfile: any = null;

  if (isDonor) {
    // Find the donor profile
    donorProfile = await prisma.donor.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    if (!donorProfile) {
      return (
        <div className="max-w-md mx-auto mt-10 text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-2">الملف الطبي غير مكتمل</h2>
          <p className="text-xs text-slate-500 mb-5">
            يرجى إكمال إعداد ملفك الطبي أولاً ليتمكن النظام من ربط وتوثيق سجلات تبرعاتك.
          </p>
          <Link
            href="/dashboard/setup"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-block transition-colors"
          >
            إكمال الملف الطبي الآن
          </Link>
        </div>
      );
    }

    // Fetch this donor's donations archive
    donations = await prisma.donation.findMany({
      where: { donorId: donorProfile.id },
      include: {
        center: true,
        certificate: true,
      },
      orderBy: { donatedAt: "desc" },
    });
  } else {
    // Admin / Staff: fetch all donations
    donations = await prisma.donation.findMany({
      include: {
        donor: { include: { user: true } },
        center: true,
        certificate: true,
      },
      orderBy: { donatedAt: "desc" },
    });
  }

  return (
    <DonationsClientView
      role={role}
      donations={donations}
      donorName={donorProfile?.user?.name || user.name}
      donorBloodType={donorProfile?.bloodType}
    />
  );
}

