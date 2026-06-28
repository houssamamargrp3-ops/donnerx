import EligibilityForm from "@/components/donors/EligibilityForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "فحص الأهلية للتبرع" };

export default async function EligibilityPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen auth-bg p-4 md:p-8">
      <EligibilityForm />
    </div>
  );
}
