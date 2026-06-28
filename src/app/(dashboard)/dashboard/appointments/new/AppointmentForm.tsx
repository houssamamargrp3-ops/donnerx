"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, MapPin, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

type Center = {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
};

export default function AppointmentForm({ centers, donorId }: { centers: Center[], donorId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate next 14 days for selection
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d.toISOString().split("T")[0];
  });

  // Dummy time slots from 9 AM to 5 PM
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId,
          centerId: selectedCenter,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("فشل حجز الموعد");
      }

      setStep(4); // Success step
      router.refresh();
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-500 -z-10 rounded-full transition-all" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
        
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
              ${step >= s ? "bg-red-500 text-white" : "bg-slate-800 text-slate-500"}`}
          >
            {s < 4 ? s : <CheckCircle2 className="w-5 h-5" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="error-toast mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Step 1: Center Selection */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xl font-bold text-white mb-4">اختر مركز التبرع</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centers.map(center => (
              <div 
                key={center.id}
                onClick={() => setSelectedCenter(center.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedCenter === center.id 
                    ? "border-red-500 bg-red-500/10" 
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white mb-1">{center.name}</h4>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {center.city}
                    </p>
                  </div>
                  {selectedCenter === center.id && <CheckCircle2 className="w-5 h-5 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleNext} 
            disabled={!selectedCenter}
            className="btn-primary w-full mt-6 flex justify-center items-center gap-2"
          >
            التالي <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Date Selection */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xl font-bold text-white mb-4">اختر اليوم</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {dates.map(date => {
              const d = new Date(date);
              const dayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'short' }).format(d);
              const dayNum = d.getDate();
              const monthName = new Intl.DateTimeFormat('ar-SA', { month: 'short' }).format(d);
              
              return (
                <div 
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all ${
                    selectedDate === date 
                      ? "border-red-500 bg-red-500/10" 
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                  }`}
                >
                  <div className="text-slate-400 text-xs mb-1">{dayName}</div>
                  <div className="text-2xl font-black text-white">{dayNum}</div>
                  <div className="text-slate-400 text-xs mt-1">{monthName}</div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-800 transition-colors">
              رجوع
            </button>
            <button 
              onClick={handleNext} 
              disabled={!selectedDate}
              className="btn-primary flex-1 flex justify-center items-center gap-2"
            >
              التالي <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Time Selection */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xl font-bold text-white mb-4">اختر الوقت المناسب</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {timeSlots.map(time => (
              <div 
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTime === time 
                    ? "border-red-500 bg-red-500/10" 
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                }`}
              >
                <Clock className={`w-5 h-5 mx-auto mb-2 ${selectedTime === time ? "text-red-500" : "text-slate-400"}`} />
                <div className="font-bold text-white">{time}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-800 transition-colors">
              رجوع
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!selectedTime || isSubmitting}
              className="btn-primary flex-1 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <span className="spinner" /> : "تأكيد الحجز"}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center animate-fade-in-up py-8">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">تم الحجز بنجاح!</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            تم تسجيل موعدك وتأكيده تلقائياً. شكراً لمساهمتك في إنقاذ الأرواح.
          </p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="btn-primary"
          >
            العودة للوحة التحكم
          </button>
        </div>
      )}
    </div>
  );
}
