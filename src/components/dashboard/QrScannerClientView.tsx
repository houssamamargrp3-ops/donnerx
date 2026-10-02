"use client";

import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, StopCircle, CheckCircle2, ScanLine, AlertTriangle, UserCheck } from "lucide-react";

export default function QrScannerClientView() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

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
    setIsCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        if ("BarcodeDetector" in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
          const scanLoop = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const scannedVal = barcodes[0].rawValue;
                  handleScanSuccess(scannedVal);
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
      console.warn("Camera error:", err);
      setErrorMsg("تعذر فتح كاميرا الجهاز. يمكنك كتابة كود الـ QR أو رقم التبرع يدويًا.");
    }
  };

  const handleScanSuccess = (payload: string) => {
    setScannedResult(payload);
    stopCamera();
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    handleScanSuccess(manualInput.trim());
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <QrCode className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-black text-slate-800">ماسح بطاقات QR الميداني المباشر</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          افتح كاميرا الهاتف لمسح بطاقة المتبرع الصحية أو كود التبرع المنزلي للتحقق الفوري المعتمد.
        </p>

        {/* Camera Start Button */}
        {!isCameraActive ? (
          <button
            onClick={startCamera}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
          >
            <Camera className="w-5 h-5" />
            <span>تشغيل كاميرا الهاتف والمسح المباشر 📷</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
          >
            <StopCircle className="w-4 h-4" />
            <span>إيقاف الكاميرا</span>
          </button>
        )}
      </div>

      {/* Live Video Camera Feed */}
      {isCameraActive && (
        <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-slate-900 aspect-video shadow-2xl flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          <div className="absolute inset-0 border-2 border-dashed border-red-400 rounded-2xl m-8 pointer-events-none flex items-center justify-center">
            <ScanLine className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <div className="absolute bottom-3 inset-x-0 text-center text-xs bg-slate-900/80 text-white py-1.5 font-bold">
            وجه كاميرا الهاتف نحو رمز QR للمسح التلقائي
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Scanned Result Banner */}
      {scannedResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-scale-up">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-black text-emerald-900">تم مسح الكود وقراءته بنجاح!</h3>
          <div className="bg-white p-3 rounded-xl border border-emerald-200 font-mono text-slate-800 text-xs font-bold break-all">
            {scannedResult}
          </div>
        </div>
      )}

      {/* Manual Input Fallback */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700">إدخال كود الـ QR أو رقم الحجز يدويًا</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="مثال: HD-20261002-8841 أو HAYATLINK:..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 outline-none focus:border-red-500 text-xs font-mono"
          />
          <button
            onClick={handleManualSubmit}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex-shrink-0"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
}
