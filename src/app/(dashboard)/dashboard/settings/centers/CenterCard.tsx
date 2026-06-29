"use client";

import { useState } from "react";
import { BloodCenter } from "@prisma/client";
import { MapPin, Activity, CheckCircle2, XCircle, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import { deleteCenter, toggleCenterStatus, updateCenter } from "@/app/actions/center.actions";

export default function CenterCard({ center }: { center: BloodCenter }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا المركز؟")) return;
    setIsDeleting(true);
    setError(null);
    const res = await deleteCenter(center.id);
    if (res.error) setError(res.error);
    setIsDeleting(false);
  };

  const handleToggle = async () => {
    setIsToggling(true);
    setError(null);
    const res = await toggleCenterStatus(center.id, center.isActive);
    if (res.error) setError(res.error);
    setIsToggling(false);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateCenter(center.id, formData);
    
    if (res.error) {
      setError(res.error);
    } else {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (isEditing) {
    return (
      <div className="labo-card p-5 border-blue-200 bg-blue-50/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">تعديل بيانات المركز</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-3 font-bold">{error}</div>}

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">اسم المركز</label>
            <input type="text" name="name" defaultValue={center.name} required className="labo-input w-full text-sm py-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">المدينة</label>
              <input type="text" name="city" defaultValue={center.city} required className="labo-input w-full text-sm py-1.5" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">السعة</label>
              <input type="number" name="capacity" defaultValue={center.capacity} required className="labo-input w-full text-sm py-1.5" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">العنوان</label>
            <input type="text" name="address" defaultValue={center.address} required className="labo-input w-full text-sm py-1.5" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهاتف (اختياري)</label>
            <input type="text" name="phone" defaultValue={center.phone || ""} className="labo-input w-full text-sm py-1.5" dir="ltr" />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="labo-btn-outline py-1.5 text-sm">إلغاء</button>
            <button type="submit" disabled={isSaving} className="labo-btn-primary py-1.5 text-sm flex gap-1 items-center">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="labo-card p-0 overflow-hidden flex flex-col sm:flex-row group">
      <div className={`w-2 ${center.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 text-lg">{center.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1
                ${center.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {center.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {center.isActive ? 'نشط' : 'معطل'}
              </span>

              {/* Actions Menu (visible on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-2 border-r pr-2">
                <button onClick={() => setIsEditing(true)} title="تعديل" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={handleToggle} disabled={isToggling} title={center.isActive ? "تعطيل" : "تفعيل"} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                  {isToggling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                </button>
                <button onClick={handleDelete} disabled={isDeleting} title="حذف" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
            <MapPin className="w-4 h-4 text-slate-400" /> {center.city} — {center.address}
          </p>
          {center.phone && (
            <p className="text-sm text-slate-500 mb-1" dir="ltr">{center.phone}</p>
          )}
          
          <div className="flex gap-4 mt-4 text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg inline-flex">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-blue-500" />
              السعة اليومية: {center.capacity} متبرع
            </div>
          </div>

          {error && <div className="text-red-500 text-xs mt-3 font-bold">{error}</div>}
        </div>
      </div>
    </div>
  );
}
