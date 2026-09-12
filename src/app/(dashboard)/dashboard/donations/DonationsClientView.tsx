"use client";

import { useState, useMemo } from "react";
import {
  Droplet,
  Award,
  Calendar,
  Search,
  MapPin,
  Clock,
  Heart,
  FileCheck,
  Building2,
  ChevronLeft,
  Filter,
  Phone,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const BLOOD_TYPE_LABEL: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

interface DonationItem {
  id: string;
  donorId: string;
  centerId: string;
  bloodType: string;
  volumeMl: number;
  donatedAt: string | Date;
  nextDonationDate?: string | Date | null;
  notes?: string | null;
  donor?: {
    id: string;
    phone?: string;
    user?: {
      name?: string | null;
      email?: string | null;
    } | null;
  } | null;
  center: {
    id: string;
    name: string;
    address: string;
    city: string;
    phone?: string | null;
  };
  certificate?: {
    id: string;
    serialNumber: string;
    issuedAt: string | Date;
  } | null;
}

interface DonationsClientViewProps {
  role: string;
  donations: DonationItem[];
  donorName?: string;
  donorBloodType?: string;
}

export default function DonationsClientView({
  role,
  donations: initialDonations,
  donorName,
  donorBloodType,
}: DonationsClientViewProps) {
  const isDonor = role === "DONOR";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("ALL");
  const [donationsList, setDonationsList] = useState<DonationItem[]>(initialDonations || []);

  // Offline caching for donations
  useEffect(() => {
    if (initialDonations && initialDonations.length > 0) {
      setDonationsList(initialDonations);
      try {
        localStorage.setItem("donner_offline_donations", JSON.stringify(initialDonations));
      } catch (_) {}
    } else {
      try {
        const cached = localStorage.getItem("donner_offline_donations");
        if (cached) {
          setDonationsList(JSON.parse(cached));
        }
      } catch (_) {}
    }
  }, [initialDonations]);

  // Summary calculations
  const totalCount = donationsList.length;
  const totalVolumeMl = donationsList.reduce((sum, d) => sum + (d.volumeMl || 450), 0);
  const totalVolumeLiters = (totalVolumeMl / 1000).toFixed(2);
  const livesSaved = totalCount * 3;
  const certificatesCount = donationsList.filter((d) => d.certificate).length;

  // Filtered donations
  const filteredDonations = useMemo(() => {
    return donationsList.filter((item) => {
      const btLabel = BLOOD_TYPE_LABEL[item.bloodType] || item.bloodType;
      const donorNameStr = item.donor?.user?.name || "";
      const centerNameStr = item.center.name || "";
      const cityStr = item.center.city || "";
      const serialStr = item.certificate?.serialNumber || "";

      const matchesSearch =
        searchTerm.trim() === "" ||
        donorNameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centerNameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cityStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        btLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serialStr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBt =
        selectedBloodType === "ALL" || item.bloodType === selectedBloodType;

      return matchesSearch && matchesBt;
    });
  }, [donations, searchTerm, selectedBloodType]);

  // Helper for human-friendly date
  const formatDonationDate = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    const dateStr = d.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const timeStr = d.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Time elapsed
    const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    let timeAgo = "";
    if (diffDays === 0) timeAgo = "اليوم";
    else if (diffDays === 1) timeAgo = "أمس";
    else if (diffDays < 30) timeAgo = `منذ ${diffDays} يوم`;
    else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      timeAgo = `منذ ${months} شهر${months > 2 ? "اً" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      timeAgo = `منذ ${years} سنة`;
    }

    return { dateStr, timeStr, timeAgo };
  };

  return (
    <div className="space-y-6">
      {/* ──────────────── Page Header ──────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-sm">
              <Droplet className="w-5 h-5 fill-red-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800">
                {isDonor ? "أرشيف وسجل تبرعاتي" : "سجل التبرعات العام"}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                {isDonor
                  ? "توثيق شامل لجميع عمليات التبرع السابقة: أين ومتى تبرعت، والشهادات الصادرة."
                  : "سجل وإدارة جميع عمليات التبرع بالدم الموثقة في كافة المراكز والمستشفيات."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDonor ? (
            <Link
              href="/dashboard/appointments/new"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-red-200 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>حجز موعد تبرع جديد</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/appointments"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>مواعيد المراكز</span>
            </Link>
          )}
        </div>
      </div>

      {/* ──────────────── Quick Stats Overview ──────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <Droplet className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalCount}</div>
            <div className="text-xs text-slate-500 font-bold">عمليات تبرع ناجحة</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {totalVolumeLiters} <span className="text-xs text-slate-400 font-bold">لتر</span>
            </div>
            <div className="text-xs text-slate-500 font-bold">حجم الدم الإجمالي</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 fill-rose-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600">{livesSaved}</div>
            <div className="text-xs text-slate-500 font-bold">حياة ساهمت بإنقاذها</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{certificatesCount}</div>
            <div className="text-xs text-slate-500 font-bold">شهادات شكر معتمدة</div>
          </div>
        </div>
      </div>

      {/* ──────────────── Search & Filter Toolbar ──────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              isDonor
                ? "ابحث باسم المركز، المدينة، رقم الشهادة..."
                : "ابحث بالاسم، المركز، المدينة، رقم الهاتف..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 pr-10 pl-4 outline-none focus:border-red-500 text-xs md:text-sm font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 flex-shrink-0 ml-1">
            <Filter className="w-3.5 h-3.5" /> الفصيلة:
          </div>
          <select
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="ALL">جميع الفصائل</option>
            {Object.entries(BLOOD_TYPE_LABEL).map(([key, val]) => (
              <option key={key} value={key}>
                {val}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ──────────────── Archive Records List ──────────────── */}
      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Droplet className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {searchTerm || selectedBloodType !== "ALL"
              ? "لا توجد نتائج مطابقة لبحثك"
              : "لا توجد عمليات تبرع مسجلة بعد"}
          </h3>
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto mb-6">
            {isDonor
              ? "كل كيس دم تتبرع به يمكن أن ينقذ 3 أرواح بشرية. بادر بحجز أول موعد لك في أقرب مركز نقل دم لتخليد عملك الإنساني!"
              : "لم يتم تسجيل أي تبرعات في النظام حتى الآن. يمكنك تسجيل التبرعات فور حضور المتبرع للمركز."}
          </p>
          {isDonor && (
            <Link
              href="/dashboard/appointments/new"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl shadow-lg shadow-red-200 inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز موعد تبرع الآن</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDonations.map((donation, idx) => {
            const { dateStr, timeStr, timeAgo } = formatDonationDate(donation.donatedAt);
            const bt = BLOOD_TYPE_LABEL[donation.bloodType] || donation.bloodType;

            return (
              <div
                key={donation.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all p-5 md:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left/Main Column: Donation Place & Time */}
                  <div className="space-y-3 flex-1">
                    {/* Status Badge & Blood Pill */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        تبرع ناجح وموثق
                      </span>

                      <span
                        className="bg-red-600 text-white font-black px-3 py-1 rounded-xl text-xs flex items-center gap-1 shadow-sm"
                        dir="ltr"
                      >
                        <Droplet className="w-3.5 h-3.5 fill-current" />
                        {bt}
                      </span>

                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                        {donation.volumeMl || 450} مل
                      </span>

                      <span className="text-slate-400 text-xs font-semibold mr-auto">
                        عملية رقم: <span className="font-mono text-slate-600 font-bold">#{donation.id.slice(-6).toUpperCase()}</span>
                      </span>
                    </div>

                    {/* Where Donated (أين تبرع) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>أين تبرع (المركز الطبي والمكان):</span>
                        </div>
                        <div className="font-black text-slate-800 text-sm md:text-base">
                          {donation.center.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>
                            {donation.center.address}, {donation.center.city}
                          </span>
                        </div>
                        {donation.center.phone && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span dir="ltr">{donation.center.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* When Donated (متى تبرع) */}
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          <span>متى تبرع (التاريخ والتوقيت):</span>
                        </div>
                        <div className="font-black text-slate-800 text-sm md:text-base">
                          {dateStr}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>الساعة: {timeStr}</span>
                          </span>
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="text-red-600 font-bold">{timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Specific: Donor Info */}
                    {!isDonor && donation.donor && (
                      <div className="bg-blue-50/50 rounded-xl p-2.5 border border-blue-100 text-xs text-slate-700 flex flex-wrap items-center gap-4">
                        <span>
                          <strong>المتبرع:</strong> {donation.donor.user?.name || "غير محدد"}
                        </span>
                        {donation.donor.phone && (
                          <span>
                            <strong>الهاتف:</strong> <span dir="ltr">{donation.donor.phone}</span>
                          </span>
                        )}
                        {donation.donor.user?.email && (
                          <span>
                            <strong>البريد:</strong> {donation.donor.user.email}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Medical Notes & Next Eligible Date */}
                    {(donation.notes || donation.nextDonationDate) && (
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4 pt-1">
                        {donation.nextDonationDate && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                            <strong>الموعد المسموح للتبرع القادم:</strong>{" "}
                            {new Date(donation.nextDonationDate).toLocaleDateString("ar-SA")}
                          </span>
                        )}
                        {donation.notes && (
                          <span className="text-slate-500">
                            <strong>ملاحظات:</strong> {donation.notes}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Certificate & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-2 pt-3 lg:pt-0 lg:border-r lg:border-slate-100 lg:pr-6 flex-shrink-0">
                    {donation.certificate ? (
                      <div className="w-full sm:w-auto text-center space-y-1.5">
                        <Link
                          href={`/dashboard/donations/${donation.id}/certificate`}
                          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <Award className="w-4 h-4" />
                          <span>عرض وطباعة الشهادة</span>
                        </Link>
                        <div className="text-[10px] text-slate-400 font-mono">
                          سيريال: {donation.certificate.serialNumber}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100 w-full sm:w-auto">
                        <span className="text-xs text-slate-400 font-medium">الشهادة قيد الاعتماد</span>
                      </div>
                    )}

                    <div className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span>أنقذت 3 أرواح</span>
                    </div>
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
