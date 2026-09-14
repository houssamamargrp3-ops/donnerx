"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  HeartPulse,
  Droplet,
  ShieldCheck,
  Mail,
  Phone,
  CalendarDays,
  Award,
  CheckCircle2,
  Syringe,
  AlertCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { bloodTypeLabel } from "@/lib/utils";

interface DonorUser {
  name: string | null;
  email: string | null;
}

interface DonorRecord {
  id: string;
  userId: string;
  bloodType: string;
  phone?: string | null;
  city?: string | null;
  eligibilityStatus: string;
  eligibilityReason?: string | null;
  lastDonationDate?: string | Date | null;
  nextEligibleDate?: string | Date | null;
  totalDonations: number;
  points: number;
  user: DonorUser;
}

interface DonorsRegistryViewProps {
  donors: DonorRecord[];
}

export default function DonorsRegistryView({ donors }: DonorsRegistryViewProps) {
  const [activeTab, setActiveTab] = useState<"actual" | "pending" | "all">("actual");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("ALL");

  // Separate donors who actually donated vs those who only registered/booked
  const actualDonorsCount = useMemo(
    () => donors.filter((d) => (d.totalDonations || 0) > 0 || d.lastDonationDate).length,
    [donors]
  );
  const pendingDonorsCount = useMemo(
    () => donors.filter((d) => (d.totalDonations || 0) === 0 && !d.lastDonationDate).length,
    [donors]
  );

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const hasDonated = (donor.totalDonations || 0) > 0 || Boolean(donor.lastDonationDate);

      // Filter by Tab
      if (activeTab === "actual" && !hasDonated) return false;
      if (activeTab === "pending" && hasDonated) return false;

      // Filter by Blood Type
      if (selectedBloodType !== "ALL" && donor.bloodType !== selectedBloodType) {
        return false;
      }

      // Filter by Search Query
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase().trim();
        const nameMatch = donor.user?.name?.toLowerCase().includes(query);
        const emailMatch = donor.user?.email?.toLowerCase().includes(query);
        const phoneMatch = donor.phone?.toLowerCase().includes(query);
        const cityMatch = donor.city?.toLowerCase().includes(query);
        if (!nameMatch && !emailMatch && !phoneMatch && !cityMatch) return false;
      }

      return true;
    });
  }, [donors, activeTab, selectedBloodType, searchTerm]);

  const formatDate = (dateVal: string | Date | null | undefined) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString("ar-SA");
    } catch {
      return "";
    }
  };

  const getSmartStatusBadge = (donor: DonorRecord) => {
    const now = new Date();
    const isRecentlyDonated =
      donor.lastDonationDate &&
      donor.nextEligibleDate &&
      new Date(donor.nextEligibleDate) > now;

    if (isRecentlyDonated) {
      return (
        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          تبرع مكتمل (فترة راحة حتى {formatDate(donor.nextEligibleDate)})
        </span>
      );
    }

    switch (donor.eligibilityStatus) {
      case "ELIGIBLE":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            مؤهل للتبرع الآن
          </span>
        );
      case "PENDING_CHECK":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
            بانتظار الفحص الطبي
          </span>
        );
      case "INELIGIBLE":
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            غير مؤهل طبياً {donor.eligibilityReason ? `(${donor.eligibilityReason})` : ""}
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold w-fit">
            غير محدد
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 mt-4 animate-fade-in-up">
      {/* Header */}
      <div className="labo-page-title mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            سجل وقائمة المتبرعين
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            إدارة كاملة لبيانات المتبرعين، السجلات الحقيقية، والحجوزات المسجلة.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-xs"
          >
            العودة <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/donations/new"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-red-200 transition-colors"
          >
            <Syringe className="w-4 h-4" />
            تسجيل تبرع / سحب دم
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("actual")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "actual"
              ? "bg-red-600 text-white shadow-md shadow-red-200"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          المتبرعون الفعليون (تم سحب الدم)
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "actual" ? "bg-white/20 text-white" : "bg-red-100 text-red-700"
            }`}
          >
            {actualDonorsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "pending"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          المسجلون والحجوزات (في انتظار أول سحب)
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "pending" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
            }`}
          >
            {pendingDonorsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-slate-800 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          جميع المسجلين ({donors.length})
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم المتبرع، البريد، أو رقم الهاتف..."
            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 pr-10 pl-4 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-sm shadow-xs"
          />
        </div>

        <select
          value={selectedBloodType}
          onChange={(e) => setSelectedBloodType(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-red-500 shadow-xs cursor-pointer"
        >
          <option value="ALL">جميع فصائل الدم</option>
          <option value="A_POSITIVE">A+</option>
          <option value="A_NEGATIVE">A-</option>
          <option value="B_POSITIVE">B+</option>
          <option value="B_NEGATIVE">B-</option>
          <option value="AB_POSITIVE">AB+</option>
          <option value="AB_NEGATIVE">AB-</option>
          <option value="O_POSITIVE">O+</option>
          <option value="O_NEGATIVE">O-</option>
        </select>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">المتبرع</th>
                <th className="p-4">فصيلة الدم</th>
                <th className="p-4">عدد التبرعات</th>
                <th className="p-4">حالة الأهلية</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    لا يوجد نتائج مطابقة للبحث.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => {
                  const hasDonated = (donor.totalDonations || 0) > 0 || Boolean(donor.lastDonationDate);
                  return (
                    <tr key={donor.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center border border-red-100">
                            {donor.user?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                              {donor.user?.name || "مستخدم"}
                              {hasDonated ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                                  متبرع فعلي
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  مسجل فقط
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                              {donor.user?.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {donor.user.email}
                                </span>
                              )}
                              {donor.phone && (
                                <span className="flex items-center gap-1" dir="ltr">
                                  <Phone className="w-3 h-3 text-slate-400" /> {donor.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-red-50 text-red-600 font-bold px-3 py-1.5 rounded-xl text-xs border border-red-100 inline-flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 fill-red-600" />
                          {bloodTypeLabel(donor.bloodType)}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>{donor.totalDonations || 0} مرات</span>
                        </div>
                        {donor.lastDonationDate && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            آخر سحب: {formatDate(donor.lastDonationDate)}
                          </div>
                        )}
                      </td>

                      <td className="p-4">{getSmartStatusBadge(donor)}</td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/donations/new?donorId=${donor.id}`}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                            title="تسجيل سحب دم لهذه الحالة"
                          >
                            <Syringe className="w-3.5 h-3.5" />
                            سحب دم
                          </Link>

                          <Link
                            href={`/dashboard/donors/${donor.id}`}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            عرض الملف
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
