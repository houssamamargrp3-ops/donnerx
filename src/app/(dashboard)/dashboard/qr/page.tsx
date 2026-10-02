import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SmartDonorCard from "@/components/dashboard/SmartDonorCard";
import QrScannerClientView from "@/components/dashboard/QrScannerClientView";

export const metadata = { title: "البطاقة الصحية الذكية | HayatLink" };

export default async function QRPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";

  // Admin/Staff view: Interactive Camera QR Scanner
  if (role !== "DONOR") {
    return <QrScannerClientView />;
  }

  // Donor view: Smart Card
  return <SmartDonorCard />;
}
