"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Phone,
  QrCode,
  Heart,
  Info,
  Building,
  UserCheck
} from "lucide-react";
import Link from "next/link";

export default function NewHomeDonationPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Form Fields
  const [city, setCity] = useState("الرياض");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 - 11:30 صباحاً");
  const [notes, setNotes] = useState("");

  // Safety Questionnaire checks
  const [q1Weight, setQ1Weight] = useState(true);
  const [q2Health, setQ2Health] = useState(true);
  const [q3Meds, setQ3Meds] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(true);

  // Auto-detect donor phone & location
  useEffect(() => {
    const fetchDonorMe = async () => {
      try {
        const res = await fetch("/api/donor/me");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.phone) setPhone(data.phone);
            if (data.city) setCity(data.city);
            if (data.address) setAddress(data.address);
          }
        }
      } catch (_) {}
    };
    fetchDonorMe();

    // Default scheduled date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().slice(0, 10));
  }, []);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState("");

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("خاصية تحديد الموقع غير مدعومة في متصفحك. يرجى كتابة العنوان يدويًا.");
      return;
    }

    setGpsLoading(true);
    setGpsSuccessMsg("");

    const options = {
      enableHighAccuracy: false, // Use false first for rapid mobile response
      timeout: 10000,
      maximumAge: 30000,
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        // Reverse Geocode via OpenStreetMap Nominatim to auto-fill address, district, and city
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};

            const detectedCity = addr.city || addr.town || addr.state || addr.governorate || "الرياض";
            const detectedDistrict = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.district || "";
            const detectedStreet = addr.road || addr.pedestrian || addr.building || addr.amenity || "";

            if (detectedCity) setCity(detectedCity);
            if (detectedDistrict) setDistrict(detectedDistrict);
            if (detectedStreet || data.display_name) {
              setAddress(detectedStreet ? `${detectedStreet} - ${detectedDistrict}` : data.display_name);
            }

            setGpsSuccessMsg(`تم تحديد موقعك (${detectedCity} ${detectedDistrict ? `- ${detectedDistrict}` : ""}) وتعبئة العنوان تلقائياً 📍`);
          } else {
            setGpsSuccessMsg("تم تحديد إحداثيات موقعك (GPS) بنجاح 📍");
          }
        } catch (_) {
          setGpsSuccessMsg("تم تحديد إحداثيات موقعك (GPS) بنجاح 📍");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        console.warn("GPS detection error:", err);
        alert("تعذر الوصول للموقع الجغرافي آليًا. يرجى كتابة اسم الحي والعنوان التفصيلي يدويًا.");
      },
      options
    );
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!district.trim() || !address.trim() || !phone.trim() || !scheduledDate || !timeSlot) {
      setErrorMsg("يرجى إكمال كافة البيانات المطلوبة قبل إرسال الطلب.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/home-donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          district,
          address,
          phone,
          latitude,
          longitude,
          scheduledDate,
          timeSlot,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ أثناء إرسال طلب التبرع المنزلي.");
      } else {
        setCreatedBooking(data.homeRequest);
        setStep(5); // Move to final confirmation screen
      }
    } catch (err: any) {
      setErrorMsg("حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  };

  const timeSlotsList = [
    "09:00 - 10:30 صباحاً",
    "10:30 - 12:00 ظهراً",
    "01:00 - 02:30 مساءً",
    "04:00 - 05:30 مساءً",
    "06:00 - 07:30 مساءً",
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in-up">
      {/* ──────────────── Top Header & Stepper ──────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-red-100 shadow-sm">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800">
          طلب فريق طبي للتبرع المنزلي بالدم 🏠🩸
        </h1>
        <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mt-1 font-medium">
          خدمة خاصة ومجانية توفر لك أقصى درجات الراحة والخصوصية والأمان بدون الحاجة للتنقل.
        </p>

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i
                  ? "w-8 bg-red-600"
                  : step > i
                  ? "w-4 bg-emerald-500"
                  : "w-4 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ──────────────── STEP 1: Service Overview & Marketing ──────────────── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              <span>لماذا تختار التبرع المنزلي عبر HayatLink؟</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>راحة تامة وخصوصية كاملة داخل منزلك في بيئة مريحة.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>فريق طبي مؤهل ومجهز بأحدث معدات الجمع المعقمة والآمنة.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>تحصل على نفس نقاط المكافآت (+100 نقطة) والشهادات المعتمدة.</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs leading-relaxed font-medium">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
              <Info className="w-4 h-4 text-amber-600" />
              <span>تنبيه وإخلاء مسؤولية طبية هامة:</span>
            </div>
            التطبيق يخصص للمواعيد والتنظيم اللوجستي فقط. الفحص الطبي النهائي وإجراء التبرع يتم حتماً وبشكل مباشر من قبل الفريق الطبي الميداني في منزلكم لضمان أقصى معايير السلامة.
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>البدء وتحديد العنوان</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ──────────────── STEP 2: Location & Address ──────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="font-black text-slate-800 text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>الموقع والعنوان التفصيلي</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المدينة</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="الرياض، جدة، الدمام..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المنطقة / الحي *</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="مثال: حي النخيل، حي العليا..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان التفصيلي (الشارع، اسم العمارة/الفيلا، رقم الشقة) *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: شارع الملك فهد، شارع 14، فيلا رقم 22..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم للتواصل المباشر مع الفريق الطبي *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-sm font-medium"
                dir="ltr"
              />
            </div>

            {gpsSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{gpsSuccessMsg}</span>
              </div>
            )}

            <button
              type="button"
              disabled={gpsLoading}
              onClick={handleDetectGPS}
              className="w-full bg-blue-50 text-blue-700 border border-blue-200 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-blue-100 transition-all disabled:opacity-50"
            >
              {gpsLoading ? (
                <>
                  <span className="spinner border-t-blue-600 w-4 h-4 border-2 rounded-full animate-spin" />
                  <span>جاري تحديد عنوانك وموقعك بواسطة الـ GPS... 🛰️</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>تحديد عنوانك وموقعك عبر الـ GPS تلقائياً {latitude ? "✓ (تم التحديد)" : ""}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
            >
              السابق
            </button>
            <button
              onClick={() => {
                if (!district.trim() || !address.trim() || !phone.trim()) {
                  setErrorMsg("يرجى كتابة الحي، العنوان التفصيلي، ورقم التواصل.");
                  return;
                }
                setErrorMsg("");
                setStep(3);
              }}
              className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl shadow-md shadow-red-200 transition-all flex items-center justify-center gap-1 text-xs"
            >
              <span>المتابعة للفحص الأولي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STEP 3: Preliminary Screening & Safety ──────────────── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="font-black text-slate-800 text-base flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-600" />
            <span>الفحص الطبي الأولي</span>
          </h2>

          <p className="text-xs text-slate-500 font-medium">
            أسئلة سريعة للتأكد من ملاءمتك الأولية للتبرع بالدم (سيقوم الفريق بإجراء الفحص الدقيق عند الوصول):
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer border border-slate-200">
              <input
                type="checkbox"
                checked={q1Weight}
                onChange={(e) => setQ1Weight(e.target.checked)}
                className="mt-0.5 accent-red-600 w-4 h-4"
              />
              <span className="text-xs text-slate-700 font-bold">
                وزني يزيد عن 50 كجم، وعمري بين 18 و 65 عاماً.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer border border-slate-200">
              <input
                type="checkbox"
                checked={q2Health}
                onChange={(e) => setQ2Health(e.target.checked)}
                className="mt-0.5 accent-red-600 w-4 h-4"
              />
              <span className="text-xs text-slate-700 font-bold">
                أشعر بصحة جيدة اليوم ولم أتبرع بالدم خلال آخر 60 يوماً.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer border border-slate-200">
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                className="mt-0.5 accent-red-600 w-4 h-4"
              />
              <span className="text-xs text-red-700 font-black">
                أقر وأعلم بأن القرار الطبي النهائي لأخذ العينة يصدره الفريق الطبي عند الزيارة المنزلية.
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
            >
              السابق
            </button>
            <button
              onClick={() => {
                if (!disclaimerAccepted || !q1Weight || !q2Health) {
                  setErrorMsg("يرجى الموافقة والتأكيد على الشروط والملاحظات الطبية.");
                  return;
                }
                setErrorMsg("");
                setStep(4);
              }}
              className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl shadow-md shadow-red-200 transition-all flex items-center justify-center gap-1 text-xs"
            >
              <span>اختيار التاريخ والوقت</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STEP 4: Date & Time Slot Picker ──────────────── */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="font-black text-slate-800 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            <span>اختر موعد زيارة الفريق الطبي</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ الزيارة</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">الفترة الزمنية المفضلة</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {timeSlotsList.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-right flex items-center justify-between ${
                      timeSlot === slot
                        ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-100"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{slot}</span>
                    <Clock className="w-4 h-4 opacity-80" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية للفريق الطبي (اختياري)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: يرجى الاتصال قبل الحضور بـ 15 دقيقة، أو وجود مصعد في المبنى..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(3)}
              className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
            >
              السابق
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="spinner border-t-white w-5 h-5 border-2 rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد وإرسال طلب التبرع المنزلي</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STEP 5: Booking Confirmation & QR Code ──────────────── */}
      {step === 5 && createdBooking && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black px-4 py-1.5 rounded-full text-xs inline-block mb-2">
              تم تسجيل الطلب بنجاح 🏠
            </span>
            <h2 className="text-2xl font-black text-slate-800">شكراً لك يا بطل!</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
              تم استلام طلبك وسيقوم الفريق الطبي بالتواصل معك وتأكيد خط سير الزيارة.
            </p>
          </div>

          {/* Booking Card Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-right space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs text-slate-500 font-bold">رقم الحجز المرجعي:</span>
              <span className="font-mono text-base font-black text-red-600">{createdBooking.bookingNumber}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">التاريخ والتوقيت:</span>
              <span className="font-bold text-slate-800">
                {new Date(createdBooking.scheduledDate).toLocaleDateString('ar-SA')} ({createdBooking.timeSlot})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">العنوان والمنطقة:</span>
              <span className="font-bold text-slate-800">{createdBooking.district} - {createdBooking.city}</span>
            </div>
          </div>

          {/* QR Code Verification Display */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-xs mx-auto">
            <div className="w-36 h-36 bg-slate-900 text-white rounded-xl mx-auto flex flex-col items-center justify-center p-3 shadow-md mb-2">
              <QrCode className="w-24 h-24 text-white" />
            </div>
            <p className="text-[11px] font-bold text-slate-500">
              رمز التحقق الرقمي الميداني (يقوم الفريق الطبي بمسحه فور الوصول)
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/dashboard/home-donations" className="w-full">
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all">
                متابعة طلباتي المنزلية
              </button>
            </Link>
            <Link href="/dashboard" className="w-full">
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all">
                العودة للرئيسية
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
