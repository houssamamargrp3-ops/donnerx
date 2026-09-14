"use client";

import { useEffect, useState } from "react";
import { Navigation, MapPin, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function LiveGPSLocation() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "denied" | "error">("idle");
  const [cityName, setCityName] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const requestGPS = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        let detectedCity = "";

        // Reverse Geocoding using OpenStreetMap Nominatim API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
          );
          if (res.ok) {
            const data = await res.json();
            detectedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.state ||
              data.address?.county ||
              "";
            setCityName(detectedCity);
          }
        } catch (_) {}

        // Send to backend
        try {
          await fetch("/api/donor/location/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: lat,
              longitude: lng,
              city: detectedCity,
            }),
          });
          setStatus("success");
        } catch (_) {
          setStatus("error");
        }
      },
      (err) => {
        console.warn("GPS Permission or error:", err.message);
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
        } else {
          setStatus("error");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    // Auto request on load if available
    requestGPS();
  }, []);

  if (status === "loading") {
    return (
      <div className="bg-blue-50/80 border border-blue-200 text-blue-800 rounded-xl p-3 text-xs font-bold flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
          <span>جاري تحديد موقعك الحي تلقائياً عبر GPS...</span>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs font-bold flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <Navigation className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          <span>
            تحديد الموقع الحي نشط (GPS):{" "}
            <strong className="text-emerald-700 font-black">
              {cityName || `${coords?.lat.toFixed(2)}, ${coords?.lng.toFixed(2)}`}
            </strong>
          </span>
        </div>
        <button
          onClick={requestGPS}
          className="text-[11px] bg-white border border-emerald-300 text-emerald-700 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          تحديث الإحداثيات
        </button>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>خاصية تحديد الموقع الجغرافي الحي (GPS) متوقفة برغبتك.</span>
        </div>
        <button
          onClick={requestGPS}
          className="bg-amber-600 text-white px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-amber-700 transition-colors cursor-pointer"
        >
          تفعيل الموقع الحي
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 text-xs font-bold flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-slate-500" />
        <span>تحديد الموقع الحي عبر الجي بي إس (GPS) لتلقي الطوارئ القريبة منك.</span>
      </div>
      <button
        onClick={requestGPS}
        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
      >
        <Navigation className="w-3 h-3" />
        تحديث الموقع الحي
      </button>
    </div>
  );
}
