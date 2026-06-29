"use client";

import { useRef, useState } from "react";
import { addCenter } from "@/app/actions/center.actions";
import { AlertCircle, Plus, Loader2 } from "lucide-react";

export default function AddCenterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await addCenter(formData);

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else if (res.success) {
      setSuccess(true);
      formRef.current?.reset();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-200 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-200 flex items-start gap-2">
          <Plus className="w-5 h-5 shrink-0" />
          تمت إضافة المركز بنجاح!
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">اسم المركز أو المستشفى <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="name" 
          required 
          placeholder="مثال: مستشفى الملك فيصل" 
          className="labo-input w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">المدينة <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="city" 
          required 
          placeholder="مثال: الرياض" 
          className="labo-input w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">العنوان بالتفصيل <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="address" 
          required 
          placeholder="مثال: حي العليا، شارع الملك فهد" 
          className="labo-input w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">السعة اليومية</label>
          <input 
            type="number" 
            name="capacity" 
            defaultValue={50}
            min={1}
            className="labo-input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">رقم الهاتف</label>
          <input 
            type="text" 
            name="phone" 
            placeholder="اختياري" 
            className="labo-input w-full"
            dir="ltr"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="labo-btn-primary w-full flex justify-center items-center gap-2 mt-2"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> حفظ المركز</>}
      </button>

    </form>
  );
}
