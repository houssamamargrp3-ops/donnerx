import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Package, Droplet, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import InventoryGrid from "@/components/dashboard/InventoryGrid";

export const metadata = { title: "مخزون الدم" };

const BLOOD_TYPES = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // In a real application, we would get the Center ID associated with this staff member.
  // For now, we will fetch the first center (assuming the admin is attached to it).
  const center = await prisma.bloodCenter.findFirst();
  if (!center) {
    return <div>لم يتم العثور على المركز الطبي.</div>;
  }

  // Fetch all inventory for this center
  const inventory = await prisma.bloodInventory.findMany({
    where: { centerId: center.id }
  });

  // Map inventory to a dictionary for easy access
  const stockMap: Record<string, number> = {};
  inventory.forEach(item => {
    stockMap[item.bloodType] = item.units;
  });

  const formatBloodType = (type: string) => {
    return type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  // Safe minimum stock level
  const MIN_STOCK = 5;
  const CRITICAL_STOCK = 2;

  let totalUnits = 0;
  let criticalCount = 0;

  const stockData = BLOOD_TYPES.map(type => {
    const units = stockMap[type] || 0;
    totalUnits += units;
    if (units <= CRITICAL_STOCK) criticalCount++;

    let status = "SAFE";
    if (units === 0) status = "EMPTY";
    else if (units <= CRITICAL_STOCK) status = "CRITICAL";
    else if (units <= MIN_STOCK) status = "LOW";

    return { type, units, status };
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
               style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)", boxShadow: "0 10px 25px rgba(37,99,235,0.4)" }}>
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">مخزون الدم</h1>
            <p className="text-slate-500 text-sm mt-1">تتبع كميات أكياس الدم المتوفرة في المركز ({center.name}).</p>
          </div>
        </div>
        
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة للوحة التحكم <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="labo-card p-6 flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20 border-0">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Droplet className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-blue-100 font-bold mb-1">إجمالي الأكياس المتوفرة</p>
            <h2 className="text-4xl font-black">{totalUnits}</h2>
          </div>
        </div>

        <div className={`labo-card p-6 flex items-center gap-4 border-0 shadow-lg ${criticalCount > 0 ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/20' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className={`${criticalCount > 0 ? 'text-red-100' : 'text-emerald-100'} font-bold mb-1`}>فصائل بحاجة للتبرع العاجل</p>
            <h2 className="text-4xl font-black">{criticalCount}</h2>
          </div>
        </div>
      </div>

      {/* Grid of Blood Types via Client Component for +/- actions */}
      <InventoryGrid stockData={stockData} centerId={center.id} />

    </div>
  );
}
