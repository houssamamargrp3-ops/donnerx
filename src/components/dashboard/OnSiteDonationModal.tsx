"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  QrCode,
  Heart,
  Activity,
  Award,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  FileCheck,
  Camera,
  StopCircle,
  ScanLine
} from "lucide-react";

interface OnSiteDonationModalProps {
  requestItem: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OnSiteDonationModal({
  requestItem,
  isOpen,
  onClose,
  onSuccess,
}: OnSiteDonationModalProps) {
  const [volume, setVolume] = useState("450");
  const [hemoglobin, setHemoglobin] = useState("14.2");
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [weight, setWeight] = useState("72");
  const [pulse, setPulse] = useState("75");
  const [temperature, setTemperature] = useState("36.6");
  const [examinationNotes, setExaminationNotes] = useState("");

  const [isQrVerified, setIsQrVerified] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [manualQrInput, setManualQrInput] = useState("");
  const [cameraError, setCameraError] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop camera on unmount or modal close
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
    setCameraError("");
    setIsCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Start scanning loop if BarcodeDetector is available
        if ("BarcodeDetector" in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
          const scanLoop = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const scannedVal = barcodes[0].rawValue;
                  verifyQrPayload(scannedVal);
                  return;
                }
              } catch (_) {}
            }
            animFrameRef.current = requestAnimationFrame(scanLoop);
          };
          animFrameRef.current = requestAnimationFrame(scanLoop);
        }
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      setCameraError("تعذر فتح الكاميرا (يرجى السماح بالوصول للشبكة/الكاميرا أو كتابة الكود يدويًا).");
    }
  };

  const verifyQrPayload = (payload: string) => {
    if (!payload || !requestItem) return;
    const cleanPayload = payload.trim();
    const bookingNum = requestItem.bookingNumber;
    const donorId = requestItem.donorId;

    if (
      cleanPayload.includes(bookingNum) ||
      cleanPayload.includes(donorId) ||
      cleanPayload.includes("HAYATLINK") ||
      cleanPayload.toLowerCase() === bookingNum.toLowerCase()
    ) {
      setIsQrVerified(true);
      stopCamera();
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      setCameraError(`رمز غير مطابق: (${cleanPayload}). الرمز المطلوب هو للطلب رقم #${bookingNum}`);
    }
  };

  const handleManualVerify = () => {
    if (!manualQrInput.trim()) return;
    verifyQrPayload(manualQrInput);
  };

  if (!isOpen || !requestItem) return null;

  const handleRecordDonation = async () => {
    setErrorMsg("");
    if (!volume || !hemoglobin || !bloodPressure) {
      setErrorMsg("يرجى إدخال حجم كيس الدم، نسبة الهيموجلوبين، وضغط الدم.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/home-donations/${requestItem.id}/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volume: Number(volume),
          hemoglobin: Number(hemoglobin),
          bloodPressure,
          weight: Number(weight),
          pulse: Number(pulse),
          temperature: Number(temperature),
          examinationNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ أثناء تسجيل عملية التبرع المنزلي.");
      } else {
        alert("تم توثيق التبرع المنزلي بنجاح! تم منح المتبرع +100 نقطة وإصدار الشهادة الرقمية 🎉");
        onSuccess();
        onClose();
      }
    } catch (err) {
      setErrorMsg("حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">توثيق وتنسيق التبرع المنزلي الميداني</h3>
              <p className="text-xs text-slate-500 font-mono">حجز: {requestItem.bookingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Interactive QR Code Verification Section */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black">ماسح الكاميرا للتحقق الرقمي (QR Verification)</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  المتبرع: {requestItem.donor?.user?.name || "متبرع منزلي"} - #{requestItem.bookingNumber}
                </div>
              </div>
            </div>

            {isQrVerified ? (
              <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ تم التحقق بنجاح</span>
              </span>
            ) : isCameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
              >
                <StopCircle className="w-4 h-4" />
                <span>إيقاف الكاميرا</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>تشغيل الكاميرا والمسح المباشر 📷</span>
              </button>
            )}
          </div>

          {/* Active Camera Stream Viewfinder */}
          {isCameraActive && (
            <div className="relative bg-black rounded-xl overflow-hidden border-2 border-red-500 aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-dashed border-red-400/70 rounded-xl m-6 pointer-events-none flex items-center justify-center">
                <ScanLine className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
              <div className="absolute bottom-2 inset-x-0 text-center text-[10px] bg-slate-900/80 text-slate-300 py-1 font-bold">
                وجه كاميرا الهاتف نحو رمز QR البطاقة الصحية للمتبرع للمسح التلقائي
              </div>
            </div>
          )}

          {cameraError && (
            <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
              <span>{cameraError}</span>
              <button
                type="button"
                onClick={() => setIsQrVerified(true)}
                className="text-[10px] bg-rose-700 hover:bg-rose-600 text-white font-black px-2 py-1 rounded-md"
              >
                تخطي وتأكيد الهوية يدويًا
              </button>
            </div>
          )}

          {/* Manual Input Fallback */}
          {!isQrVerified && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={manualQrInput}
                onChange={(e) => setManualQrInput(e.target.value)}
                placeholder={`أدخل رقم الحجز الميداني (#${requestItem.bookingNumber}) للمطابقة`}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-1.5 px-3 outline-none focus:border-red-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleManualVerify}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0"
              >
                تحقق
              </button>
            </div>
          )}
        </div>

        {/* On-Site Medical Screening Form */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-red-600" />
            <span>نتائج الفحص الطبي الميداني قبل التبرع:</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نسبة الهيموجلوبين (g/dL) *</label>
              <input
                type="text"
                value={hemoglobin}
                onChange={(e) => setHemoglobin(e.target.value)}
                placeholder="13.5 - 17.5"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ضغط الدم (mmHg) *</label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120/80"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حجم الدم المجمع (مل) *</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="450"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الوزن (كجم)</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نبض القلب (bpm)</label>
              <input
                type="text"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="75"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">درجة الحرارة (°C)</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="36.6"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الفحص الطبي الميداني</label>
            <textarea
              value={examinationNotes}
              onChange={(e) => setExaminationNotes(e.target.value)}
              placeholder="تم سحب العينة بنجاح، حالة المتبرع مستقرة وممتازة..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-medium"
            />
          </div>
        </div>

        {/* Reward Summary Preview */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>مكافأة المتبرع الفورية:</span>
          </span>
          <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-lg">
            +100 نقطة + شهادة شكر رقمية
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
          >
            إلغاء
          </button>
          <button
            disabled={loading}
            onClick={handleRecordDonation}
            className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow-md shadow-red-200 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="spinner border-t-white w-4 h-4 border-2 rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>توثيق عملية التبرع وإصدار الشهادة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
