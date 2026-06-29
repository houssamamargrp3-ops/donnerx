"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDonor } from "@/app/actions/donor.actions";

export default function DeleteDonorButton({ donorId }: { donorId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("هل أنت متأكد من حذف ملف هذا المتبرع نهائياً؟ سيتم حذف حسابه بالكامل.")) {
      startTransition(async () => {
        const result = await deleteDonor(donorId);
        if (result.success) {
          router.push("/dashboard/donors");
          router.refresh();
        } else {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 font-bold bg-white border border-red-200 hover:bg-red-50 transition-colors shadow-sm text-sm"
    >
      {isPending ? <span className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
      حذف الملف
    </button>
  );
}
