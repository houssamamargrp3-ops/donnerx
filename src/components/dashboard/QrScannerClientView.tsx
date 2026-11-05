"use client";

import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import {
  QrCode,
  Camera,
  StopCircle,
  CheckCircle2,
  ScanLine,
  AlertTriangle,
  UserCheck,
  UserX,
  Phone,
  Droplet,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Award,
  ArrowRight,
  Heart,
  X,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

const BLOOD_TYPE_LABELS: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-",
  B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

export default function QrScannerClientView() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Donor Lookup state
  const [loadingDonor, setLoadingDonor] = useState(false);
  const [donorData, setDonorData] = useState<any>(null);
  const [centers, setCenters] = useState<any[]>([]);

  // Action Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMsg("");
    setScannedResult(null);
    setDonorData(null);
    setActionSuccessMsg("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg("المتصفح لا يدعم الوصول المباشر للكاميرا في هذا النطاق (يتطلب تشغيل الموقع عبر HTTPS أو localhost). يمكنك رفع صورة رمز الـ QR أو كتابة الكود يدوياً.");
      return;
    }

    setIsCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();

        // Canvas for processing video frames
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const scanLoop = () => {
          if (!videoRef.current || !ctx) {
            animFrameRef.current = requestAnimationFrame(scanLoop);
            return;
          }

          if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              // jsQR universal scanning engine (works on all browsers)
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
              });

              if (code && code.data && code.data.trim()) {
                handleScanSuccess(code.data.trim());
                return;
              }
            } catch (scanErr) {
              console.warn("Scan frame decode warning:", scanErr);
            }
          }

          animFrameRef.current = requestAnimationFrame(scanLoop);
        };

        animFrameRef.current = requestAnimationFrame(scanLoop);
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      setIsCameraActive(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMsg("تم رفض إذن الوصول للكاميرا من المتصفح. يرجى تفعيل إذن الكاميرا أو رفع صورة الـ QR أو إدخال الكود يدوياً.");
      } else {
        setErrorMsg("تعذر فتح كاميرا الجهاز. يمكنك رفع صورة الـ QR أو إدخال كود المتبرع يدوياً بالأسفل.");
      }
    }
  };

  // Image Upload Scanner Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });

          if (code && code.data && code.data.trim()) {
            handleScanSuccess(code.data.trim());
          } else {
            setErrorMsg("لم يتم العثور على رمز QR واضح داخل الصورة المحددة. يرجى التأكد من وضوح الصورة وإعادة المحاولة.");
          }
        } catch (_) {
          setErrorMsg("حدث خطأ أثناء معالجة الصورة المرفوعة.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input value to allow selecting same file again
    e.target.value = "";
  };

  const lookupDonor = async (payload: string) => {
    setLoadingDonor(true);
    setErrorMsg("");
    setActionSuccessMsg("");

    try {
      const res = await fetch(`/api/donors/lookup?q=${encodeURIComponent(payload)}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "لم يتم العثور على متبرع مطابق لهذا الكود");
        setDonorData(null);
      } else {
        setDonorData(data.donor);
        setCenters(data.centers || []);
      }
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم للتحقق من المتبرع");
    } finally {
      setLoadingDonor(false);
    }
  };

  const handleScanSuccess = (payload: string) => {
    setScannedResult(payload);
    stopCamera();
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (_) {}
    lookupDonor(payload);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    setScannedResult(manualInput.trim());
    lookupDonor(manualInput.trim());
  };

  const resetScanner = () => {
    setScannedResult(null);
    setDonorData(null);
    setErrorMsg("");
    setActionSuccessMsg("");
    setManualInput("");
  };

  // Staff Decision: Accept
  const handleAcceptDonor = async () => {
    if (!donorData) return;
    setActionLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/donors/${donorData.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ACCEPT" }),
      });
      const data = await res.json();
      if (res.ok) {
        setDonorData({ ...donorData, eligibilityStatus: "ELIGIBLE", eligibilityReason: null });
        setActionSuccessMsg("✅ تم قبول المتبرع واعتماد لياقته الطبية بنجاح!");
      } else {
        setErrorMsg(data.error || "فشل قبول المتبرع");
      }
    } catch (_) {
      setErrorMsg("خطأ في الاتصال بالخادم");
    } finally {
      setActionLoading(false);
    }
  };

  // Staff Decision: Reject
  const handleRejectDonor = async () => {
    if (!donorData) return;
    setActionLoading(true);
    setErrorMsg("");
    try {
      const reasonText = rejectionReason.trim() || "غير لائق طبياً للتبرع حالياً بناءً على فحص المركز";
      const res = await fetch(`/api/donors/${donorData.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT", reason: reasonText }),
      });
      const data = await res.json();
      if (res.ok) {
        setDonorData({
          ...donorData,
          eligibilityStatus: "INELIGIBLE",
          eligibilityReason: reasonText,
        });
        setRejectModalOpen(false);
        setRejectionReason("");
        setActionSuccessMsg("❌ تم تسجيل رفض المتبرع وتحديث الإحصائيات بنجاح.");
      } else {
        setErrorMsg(data.error || "فشل تسجيل الرفض");
      }
    } catch (_) {
      setErrorMsg("خطأ في الاتصال بالخادم");
    } finally {
      setActionLoading(false);
    }
  };

  const formatBt = (type: string) =>
    BLOOD_TYPE_LABELS[type] || type?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || "—";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* ──────────────── Top Card ──────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <QrCode className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800">
            ماسح بطاقات QR الميداني الشامل 📷
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mt-1">
            يعمل مباشرة عبر محرك فك التشفير البرمجي المدمج لجميع الهواتف والمتصفحات. يمكنك المسح المباشر بالكاميرا أو رفع صورة الـ QR.
          </p>
        </div>

        {/* Action Buttons: Camera + Image Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>تشغيل كاميرا الهاتف والمسح المباشر 📷</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full sm:flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <StopCircle className="w-4 h-4" />
              <span>إيقاف تشغيل الكاميرا</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs border border-slate-200 active:scale-95 flex-shrink-0"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>رفع صورة QR من الجهاز 🖼️</span>
          </button>
        </div>
      </div>

      {/* ──────────────── Active Video Viewfinder ──────────────── */}
      {isCameraActive && (
        <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-slate-900 aspect-video shadow-2xl flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          <div className="absolute inset-0 border-2 border-dashed border-red-400 rounded-2xl m-8 pointer-events-none flex items-center justify-center">
            <ScanLine className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <div className="absolute bottom-3 inset-x-0 text-center text-xs bg-slate-900/80 text-white py-1.5 font-bold">
            وجّه الكاميرا نحو رمز QR لبطاقة المتبرع الصحية للمسح التلقائي
          </div>
        </div>
      )}

      {/* ──────────────── Loading State ──────────────── */}
      {loadingDonor && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-3 animate-fade-in">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto" />
          <h3 className="font-black text-slate-800 text-base">جاري جلب وفحص ملف المتبرع المنسق...</h3>
          <p className="text-xs text-slate-400">التحقق من السجل الطبي وحالة الأهلية المعتمدة</p>
        </div>
      )}

      {/* ──────────────── Error Message ──────────────── */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={resetScanner}
            className="text-[11px] underline text-rose-700 hover:text-rose-900 font-black"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* ──────────────── Success Action Notification ──────────────── */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-black flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ──────────────── DONOR DETAILS PROFILE CARD ──────────────── */}
      {donorData && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up space-y-5">
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-red-500/30">
                {donorData.name?.slice(0, 1) || "م"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">{donorData.name}</h2>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                    #{donorData.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-mono mt-0.5 flex items-center gap-2">
                  <span>{donorData.email || "بدون بريد"}</span>
                  {donorData.city && <span>• {donorData.city}</span>}
                </div>
              </div>
            </div>

            {/* Blood Type Badge */}
            <div className="bg-red-600 text-white px-4 py-2 rounded-2xl font-black text-xl flex items-center gap-1.5 shadow-lg shadow-red-600/30">
              <Droplet className="w-4 h-4 fill-current" />
              <span>{formatBt(donorData.bloodType)}</span>
            </div>
          </div>

          <div className="px-6 space-y-4">
            {/* Eligibility Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                donorData.eligibilityStatus === "ELIGIBLE"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : donorData.eligibilityStatus === "INELIGIBLE"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {donorData.eligibilityStatus === "ELIGIBLE" ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                )}
                <div>
                  <h4 className="font-black text-sm">
                    {donorData.eligibilityStatus === "ELIGIBLE"
                      ? "المتبرع مؤهل طبياً للتبرع بالدم ✓"
                      : donorData.eligibilityStatus === "INELIGIBLE"
                      ? "المتبرع غير مؤهل للتبرع حالياً ✗"
                      : "المتبرع بانتظار الفحص السريري ⚠️"}
                  </h4>
                  {donorData.eligibilityReason && (
                    <p className="text-xs mt-0.5 opacity-80 font-medium">
                      السبب: {donorData.eligibilityReason}
                    </p>
                  )}
                </div>
              </div>

              {donorData.nextEligibleDate && (
                <div className="text-left text-[11px] font-mono">
                  <div className="opacity-60">التاريخ القادم:</div>
                  <div className="font-bold">
                    {new Date(donorData.nextEligibleDate).toLocaleDateString("ar-SA")}
                  </div>
                </div>
              )}
            </div>

            {/* Donor Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <div className="text-slate-400 text-[10px] font-bold">إجمالي التبرعات</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">
                  {donorData.totalDonations || 0}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <div className="text-slate-400 text-[10px] font-bold">النقاط والرتبة</div>
                <div className="text-lg font-black text-amber-600 mt-0.5 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{donorData.points || 0}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <div className="text-slate-400 text-[10px] font-bold">الوزن المسجل</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">
                  {donorData.weight ? `${donorData.weight} كجم` : "غير محدد"}
                </div>
              </div>
            </div>

            {/* Direct Phone Call */}
            {donorData.phone && (
              <div className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-100 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>رقم الهاتف:</span>
                  <span className="font-mono" dir="ltr">{donorData.phone}</span>
                </div>
                <a
                  href={`tel:${donorData.phone}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm"
                >
                  اتصال مباشر
                </a>
              </div>
            )}

            {/* Pending Appointment if available */}
            {donorData.pendingAppointment && (
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>يوجد موعد محجوز قادم:</span>
                  </span>
                  <span className="text-[11px] font-bold text-purple-700 font-mono">
                    {new Date(donorData.pendingAppointment.scheduledAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>
                <div className="text-xs text-purple-800">
                  المركز: {donorData.pendingAppointment.center?.name || "المركز الرئيسي"}
                </div>
              </div>
            )}

            {/* ─── ACTION BUTTONS (ACCEPT / REJECT / RECORD DONATION) ─── */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                الإجراءات والقرارات الطبية الفورية:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. Record Donation */}
                <Link
                  href={`/dashboard/donations/new?donorId=${donorData.id}&bloodType=${donorData.bloodType}`}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-200 transition-all active:scale-95 text-center"
                >
                  <Droplet className="w-4 h-4 fill-current" />
                  <span>تسجيل تبرع بالدم الآن 🩸</span>
                </Link>

                {/* 2. Full Donor Profile Link */}
                <Link
                  href={`/dashboard/donors/${donorData.id}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 text-center"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>فتح الملف الطبي الشامل</span>
                </Link>

                {/* 3. Accept Donor */}
                <button
                  onClick={handleAcceptDonor}
                  disabled={actionLoading}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>اعتماد الأهلية (مقبول) ✅</span>
                </button>

                {/* 4. Reject Donor */}
                <button
                  onClick={() => setRejectModalOpen(true)}
                  disabled={actionLoading}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <UserX className="w-4 h-4 text-rose-600" />
                  <span>رفض المتبرع (غير لائق) ❌</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reset / Scan Next */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <button
              onClick={resetScanner}
              className="text-slate-600 hover:text-slate-900 font-black text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>مسح بطاقة متبرع أخرى</span>
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── Manual Input Fallback ──────────────── */}
      {!donorData && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            إدخال كود الـ QR، رقم المتبرع، أو رقم الحجز يدوياً
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
              placeholder="مثال: cly... أو رقم الهاتف أو HD-20261002-8841"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-xs font-mono"
            />
            <button
              onClick={handleManualSubmit}
              disabled={loadingDonor}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex-shrink-0 transition-all disabled:opacity-50"
            >
              {loadingDonor ? <Loader2 className="w-4 h-4 animate-spin" /> : "بحث وتحقق"}
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── REJECTION MODAL ──────────────── */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-right">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">تسجيل رفض المتبرع</h4>
                  <p className="text-xs text-slate-500 font-medium">{donorData?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              سيتم تسجيل سبب الرفض وإدراجه في إحصائيات المرفوضين في لوحة التحكم وتحديث حالة المتبرع.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اختر سبب الرفض أو اكتبه:</label>
              <select
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs font-bold mb-2 outline-none focus:border-rose-500"
              >
                <option value="">-- أسباب طبية شائعة --</option>
                <option value="انخفاض نسبة الهيموجلوبين في الدم عن الحد الأدنى">انخفاض نسبة الهيموجلوبين (فقر دم)</option>
                <option value="ضغط الدم غير ملائم (مرتفع أو منخفض)">ضغط الدم غير ملائم</option>
                <option value="الوزن أقل من 50 كجم">الوزن أقل من 50 كجم</option>
                <option value="إجراء حجامة أو وشم خلال أقل من 6 أشهر">وشم أو حجامة قريبة</option>
                <option value="إجراء عملية جراحية حديثة">عملية جراحية حديثة</option>
                <option value="تناول أدوية مانعة للتبرع بالدم">أدوية مانعة للتبرع</option>
                <option value="أسباب وقائية وتنظيمية أخرى">أسباب أخرى</option>
              </select>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="أو اكتب تفاصيل سبب الرفض بدقة هنا..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="w-1/3 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleRejectDonor}
                disabled={actionLoading}
                className="w-2/3 bg-rose-600 hover:bg-rose-700 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />}
                <span>تأكيد الرفض والإحصاء</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
