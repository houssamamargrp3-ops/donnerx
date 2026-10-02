"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Droplet,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Users,
  Award,
  Calendar
} from "lucide-react";

export default function HomeAnalyticsView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/home-donations/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="spinner border-t-red-600 w-8 h-8 border-3 rounded-full animate-spin" />
      </div>
    );
  }

  const {
    totalRequests = 0,
    acceptedRequests = 0,
    completedVisits = 0,
    cancelledRequests = 0,
    homeBagsCount = 0,
    homeTotalVolumeMl = 0,
    centerDonationsCount = 0,
    topAreas = [],
    teamStats = [],
    responseTimeHours = 2.4,
    punctualityRate = 96.5,
  } = data || {};

  const totalAllDonations = homeBagsCount + centerDonationsCount || 1;
  const homePercentage = Math.round((homeBagsCount / totalAllDonations) * 100);
  const centerPercentage = 100 - homePercentage;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ──────────────── Header ──────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              لوحة تحليلات وتقارير التبرع المنزلي 📊
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              إحصائيات تفصيلية لمعدلات الأداء، عدد أكياس الدم المجمعة، دقة الفرق، ومقارنة التبرع المنزلي بالمركزي.
            </p>
          </div>
        </div>
      </div>

      {/* ──────────────── 4 Top Key Metrics ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">إجمالي طلبات التبرع</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalRequests}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            مقبولة ومؤكدة: {acceptedRequests}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">أكياس الدم المجمعة منزلياً</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600">{homeBagsCount} <span className="text-xs text-slate-400 font-bold">كيس</span></div>
          <div className="text-[11px] text-slate-500 font-bold mt-1">
            الحجم: {(homeTotalVolumeMl / 1000).toFixed(1)} لتر دم
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">معدل سرعة الاستجابة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{responseTimeHours} <span className="text-xs text-slate-400 font-bold">ساعة</span></div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            نسبة الالتزام بالمواعيد: {punctualityRate}%
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">الزيارات المكتملة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{completedVisits}</div>
          <div className="text-[11px] text-rose-500 font-bold mt-1">
            طلبات ملغاة: {cancelledRequests}
          </div>
        </div>
      </div>

      {/* ──────────────── Center vs. Home Comparison ──────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <span>مقارنة إحصائية: تبرعات المراكز الطبية مقابل التبرع المنزلي</span>
        </h3>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>التبرع المنزلي (Home Visits)</span>
              </span>
              <span>{homeBagsCount} كيس ({homePercentage}%)</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(homePercentage, 10)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>تبرعات المراكز والمستشفيات (Center Donations)</span>
              </span>
              <span>{centerDonationsCount} كيس ({centerPercentage}%)</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(centerPercentage, 10)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Top Areas & Team Performance ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Active Areas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>أكثر المناطق والأحياء طلباً للتبرع المنزلي</span>
          </h3>

          <div className="space-y-3">
            {topAreas.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">لا توجد بيانات كافية بعد</div>
            ) : (
              topAreas.map((area: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{area.district}</span>
                  </div>
                  <span className="bg-white font-mono text-xs font-black text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                    {area.count} طلبات
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Medical Teams Visit Totals */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>إنجازات الفرق الطبية الميدانية</span>
          </h3>

          <div className="space-y-3">
            {teamStats.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">لا توجد فرق مخصصة بعد</div>
            ) : (
              teamStats.map((team: any) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="font-bold text-xs text-slate-800">{team.name}</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs px-3 py-1 rounded-lg">
                    {team.completedVisits} زيارات منفذة
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
