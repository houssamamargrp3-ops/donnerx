"use client";

import { adjustInventory } from "@/app/actions/inventory.actions";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

interface InventoryGridProps {
  stockData: {
    type: string;
    units: number;
    status: string;
  }[];
  centerId: string;
}

export default function InventoryGrid({ stockData, centerId }: InventoryGridProps) {
  const [isPending, startTransition] = useTransition();

  const handleAdjust = (bloodType: string, action: "increase" | "decrease") => {
    startTransition(async () => {
      const result = await adjustInventory(centerId, bloodType, action);
      if (result.error) {
        alert(result.error);
      }
    });
  };

  const formatBloodType = (type: string) => {
    return type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stockData.map(item => (
        <div key={item.type} className={`labo-card p-6 relative overflow-hidden transition-all hover:shadow-md ${item.status === 'EMPTY' ? 'border-red-200' : ''} ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
          
          <div className={`absolute top-0 right-0 w-2 h-full ${
            item.status === 'SAFE' ? 'bg-emerald-500' :
            item.status === 'LOW' ? 'bg-yellow-500' :
            item.status === 'CRITICAL' ? 'bg-orange-500' : 'bg-red-600'
          }`} />

          <div className="flex justify-between items-start mb-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black ${
              item.status === 'SAFE' ? 'bg-emerald-50 text-emerald-600' :
              item.status === 'LOW' ? 'bg-yellow-50 text-yellow-600' :
              item.status === 'CRITICAL' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
            }`}>
              {formatBloodType(item.type)}
            </div>
            
            {item.status !== 'SAFE' && (
              <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                item.status === 'LOW' ? 'bg-yellow-100 text-yellow-700' :
                item.status === 'CRITICAL' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              }`}>
                {item.status === 'EMPTY' ? 'نفذت الكمية' : item.status === 'CRITICAL' ? 'حرج جداً' : 'منخفض'}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-800">{item.units} <span className="text-sm font-bold text-slate-500">وحدة</span></h3>
            
            <div className="flex flex-col gap-1">
              <button onClick={() => handleAdjust(item.type, "increase")} className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={() => handleAdjust(item.type, "decrease")} disabled={item.units === 0} className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-slate-100">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action for critical */}
          {(item.status === 'CRITICAL' || item.status === 'EMPTY') && (
            <Link href={`/dashboard/emergency?bloodType=${item.type}`} className="mt-4 block w-full py-2 text-center text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              إنشاء نداء طوارئ
            </Link>
          )}

        </div>
      ))}
    </div>
  );
}
