"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  ChevronLeft,
  UserCheck
} from "lucide-react";

interface VisitRoutesViewProps {
  requests: any[];
  onRefresh: () => void;
}

export default function VisitRoutesView({ requests, onRefresh }: VisitRoutesViewProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("ALL");
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/medical-teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data || []);
      }
    } catch (_) {}
  };

  // Filter requests active for routes
  const activeRouteRequests = requests.filter(r => {
    const matchesTeam = selectedTeam === "ALL" || r.medicalTeamId === selectedTeam;
    const matchesStatus = ["CONFIRMED", "IN_ROUTE", "ARRIVED", "COMPLETED"].includes(r.status);
    return matchesTeam && matchesStatus;
  });

  // Sort visits chronologically by timeSlot / date
  const sortedVisits = [...activeRouteRequests].sort((a, b) => {
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/home-donations/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (_) {}
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ──────────────── Header & Team Selector ──────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">تنظيم وتنسيق خط سير الزيارات الميدانية 🗺️</h2>
              <p className="text-xs text-slate-500 font-medium">
                ترتيب مسار الزيارات اليومية حسب المنطقة والتوقيت اللوجستي الأمثل لفرق التبرع المنزلي.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 flex-shrink-0">تصفية حسب الفريق:</span>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-blue-500 cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">جميع الفرق الطبية الميدانية</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ──────────────── Map View Visual Banner ──────────────── */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-blue-500/20 text-blue-300 font-mono text-[11px] px-3 py-1 rounded-full border border-blue-400/30">
              خريطة المسار الذكي الميداني
            </span>
            <h3 className="text-lg font-black text-white">
              إجمالي المحطات المجدولة اليوم: {sortedVisits.length} زيارة منزليّة
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              يتم تحديث ترتيب المحطات آلياً بناءً على تقارب الأحياء الزمنية لتقليل زمن الاستجابة.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-bold bg-white/10 px-3 py-2 rounded-xl flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>فرق العمل النشطة: {teams.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────── Sequence Visit Timeline Cards ──────────────── */}
      {sortedVisits.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا توجد زيارات مجدولة في خط السير الحالي</h3>
          <p className="text-xs text-slate-500 mt-1">قم بتأكيد الحجوزات وتعيين الفرق الطبية لتظهر المحطات هنا.</p>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-1 before:bg-slate-200">
          {sortedVisits.map((visit, index) => {
            const isCompleted = visit.status === "COMPLETED";
            const isInRoute = visit.status === "IN_ROUTE";
            const isArrived = visit.status === "ARRIVED";

            return (
              <div key={visit.id} className="relative pr-14 animate-fade-in-up">
                {/* Step Circle Badge */}
                <div
                  className={`absolute right-2 top-4 w-9 h-9 rounded-full font-black text-xs flex items-center justify-center border-4 border-slate-100 shadow-sm z-10 ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isArrived
                      ? "bg-amber-500 text-white"
                      : isInRoute
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  {index + 1}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 font-mono text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        #{visit.bookingNumber}
                      </span>
                      <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                        فصيلة {visit.bloodType}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        الفريق: <strong className="text-slate-800">{visit.medicalTeam?.name || "غير محدد"}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isArrived
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : isInRoute
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {isCompleted
                          ? "✓ اكتملت الزيارة والتبرع"
                          : isArrived
                          ? "📍 وصل الفريق للمنزل"
                          : isInRoute
                          ? "🚗 الفريق في الطريق"
                          : "في الانتظار"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                      <div className="text-slate-400 font-bold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>بيانات المتبرع:</span>
                      </div>
                      <div className="font-bold text-slate-800 text-sm">
                        {visit.donor?.user?.name || "متبرع منزلي"}
                      </div>
                      <div className="text-blue-600 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span dir="ltr">{visit.phone}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                      <div className="text-slate-400 font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>عنوان المحطة:</span>
                      </div>
                      <div className="font-bold text-slate-800">
                        {visit.district} - {visit.city}
                      </div>
                      <div className="text-slate-500 truncate">{visit.address}</div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                      <div className="text-slate-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>الموعد والفترة:</span>
                      </div>
                      <div className="font-bold text-slate-800">
                        {new Date(visit.scheduledDate).toLocaleDateString("ar-SA")}
                      </div>
                      <div className="text-slate-600 font-bold">{visit.timeSlot}</div>
                    </div>
                  </div>

                  {/* Status Change Quick Actions for Logistics Staff */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleUpdateStatus(visit.id, "IN_ROUTE")}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 transition-all"
                    >
                      تغيير إلى: في الطريق 🚗
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(visit.id, "ARRIVED")}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-amber-200 transition-all"
                    >
                      تغيير إلى: تم الوصول 📍
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
