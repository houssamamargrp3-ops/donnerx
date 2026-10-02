"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Truck,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Droplet,
  BarChart3,
  Navigation,
  Plus,
  Phone,
  Eye,
  XCircle,
  FileCheck
} from "lucide-react";
import Link from "next/link";

import AssignTeamModal from "./AssignTeamModal";
import OnSiteDonationModal from "./OnSiteDonationModal";
import VisitRoutesView from "./VisitRoutesView";
import HomeAnalyticsView from "./HomeAnalyticsView";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "جديد (قيد المراجعة)", color: "bg-amber-50 text-amber-700 border-amber-200" },
  REVIEW: { label: "قيد المراجعة", color: "bg-blue-50 text-blue-700 border-blue-200" },
  CONFIRMED: { label: "مؤكد", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  IN_ROUTE: { label: "في الطريق 🚗", color: "bg-blue-600 text-white border-blue-600" },
  ARRIVED: { label: "تم الوصول 📍", color: "bg-purple-600 text-white border-purple-600" },
  COMPLETED: { label: "مكتمل ✓", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "ملغى ❌", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function HomeDonationsAdminView({ role }: { role: string }) {
  const isDonor = role === "DONOR";

  const [activeTab, setActiveTab] = useState<"TABLE" | "ROUTES" | "ANALYTICS">("TABLE");
  const [quickFilterTab, setQuickFilterTab] = useState<"ALL" | "NEW" | "COMPLETED" | "CANCELLED">("ALL");

  const [requests, setRequests] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedBloodType, setSelectedBloodType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  // Modals state
  const [assignModalItem, setAssignModalItem] = useState<any>(null);
  const [onSiteModalItem, setOnSiteModalItem] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
    fetchTeams();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/home-donations");
      if (res.ok) {
        const data = await res.json();
        setRequests(data || []);
      }
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/medical-teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data || []);
      }
    } catch (_) {}
  };

  // Extract unique areas for filtering
  const uniqueAreas = useMemo(() => {
    const areas = new Set<string>();
    requests.forEach(r => {
      if (r.district) areas.add(r.district);
    });
    return Array.from(areas);
  }, [requests]);

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      // Tab filter
      if (quickFilterTab === "NEW" && !["PENDING", "REVIEW"].includes(r.status)) return false;
      if (quickFilterTab === "COMPLETED" && r.status !== "COMPLETED") return false;
      if (quickFilterTab === "CANCELLED" && r.status !== "CANCELLED") return false;

      // Dropdown filters
      if (selectedArea !== "ALL" && r.district !== selectedArea) return false;
      if (selectedBloodType !== "ALL" && r.bloodType !== selectedBloodType) return false;
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (selectedTeam !== "ALL" && r.medicalTeamId !== selectedTeam) return false;

      if (selectedDate) {
        const reqDate = new Date(r.scheduledDate).toISOString().slice(0, 10);
        if (reqDate !== selectedDate) return false;
      }

      // Search term (Donor Name or Booking ID)
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const donorName = r.donor?.user?.name?.toLowerCase() || "";
        const bookingNum = r.bookingNumber?.toLowerCase() || "";
        const phone = r.phone || "";
        const district = r.district?.toLowerCase() || "";

        return (
          donorName.includes(term) ||
          bookingNum.includes(term) ||
          phone.includes(term) ||
          district.includes(term)
        );
      }

      return true;
    });
  }, [requests, quickFilterTab, selectedArea, selectedBloodType, selectedStatus, selectedTeam, selectedDate, searchTerm]);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* ──────────────── Page Title Banner ──────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-200">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800">
              {isDonor ? "طلباتي وسجل التبرع المنزلي 🏠" : "إدارة وتنظيم حجوزات التبرع المنزلي 🏠"}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              {isDonor
                ? "متابعة حالة طلبات زيارات الفريق الطبي لمنزلك وحجوزات التبرع الميدانية."
                : "سجل مستقل وخاص لإدارة حجوزات التبرع المنزلي، تعيين الفرق الميدانية، وتنظيم خط السير."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/home-donations/new"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-red-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>طلب تبرع منزلي جديد</span>
          </Link>
        </div>
      </div>

      {/* ──────────────── Navigation Tabs (Admin/Staff) ──────────────── */}
      {!isDonor && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("TABLE")}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "TABLE"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>جدول الحجوزات والطلبات ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ROUTES")}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "ROUTES"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>خط سير الزيارات اللوجستي</span>
          </button>

          <button
            onClick={() => setActiveTab("ANALYTICS")}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "ANALYTICS"
                ? "bg-red-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>تحليلات التبرع المنزلي</span>
          </button>
        </div>
      )}

      {/* ──────────────── VIEW 1: TABLE VIEW ──────────────── */}
      {(activeTab === "TABLE" || isDonor) && (
        <div className="space-y-4">
          {/* Quick Preset Filter Tabs (Item 10) */}
          {!isDonor && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setQuickFilterTab("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  quickFilterTab === "ALL"
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                جميع الطلبات ({requests.length})
              </button>
              <button
                onClick={() => setQuickFilterTab("NEW")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  quickFilterTab === "NEW"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                الطلبات الجديدة (قيد المراجعة)
              </button>
              <button
                onClick={() => setQuickFilterTab("COMPLETED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  quickFilterTab === "COMPLETED"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                الطلبات المكتملة
              </button>
              <button
                onClick={() => setQuickFilterTab("CANCELLED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  quickFilterTab === "CANCELLED"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                الطلبات الملغاة
              </button>
            </div>
          )}

          {/* Filtering Toolbar (Item 10) */}
          {!isDonor && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث باسم المتبرع أو رقم الحجز HD..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 pr-10 pl-4 outline-none focus:border-red-500 text-xs md:text-sm font-medium"
                  />
                </div>

                {/* Filter Controls Grid */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Area Filter */}
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="ALL">جميع المناطق</option>
                    {uniqueAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>

                  {/* Blood Type Filter */}
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="ALL">جميع الفصائل</option>
                    {["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"].map((bt) => (
                      <option key={bt} value={bt}>
                        {bt.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="ALL">جميع الحالات</option>
                    {Object.entries(STATUS_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>

                  {/* Team Filter */}
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="ALL">جميع الفرق الطبية</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  {/* Date Picker */}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-red-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bookings Table / List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="spinner border-t-red-600 w-8 h-8 border-3 rounded-full animate-spin" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                {searchTerm || selectedArea !== "ALL" || selectedBloodType !== "ALL"
                  ? "لا توجد نتائج مطابقة لفلترة البحث"
                  : "لا توجد طلبات تبرع منزلي مسجلة"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                يمكنك إنشاء طلب تبرع منزلي جديد بسهولة من خلال خيار طلب فريق طبي.
              </p>
              <Link href="/dashboard/home-donations/new">
                <button className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md">
                  اطلب فريقًا طبيًا إلى منزلك
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">المتبرع</th>
                      <th className="p-3.5">الفصيلة</th>
                      <th className="p-3.5">المنطقة والحي</th>
                      <th className="p-3.5">التاريخ والوقت</th>
                      <th className="p-3.5">الفريق الطبي</th>
                      <th className="p-3.5">الحالة</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => {
                      const st = STATUS_LABELS[req.status] || { label: req.status, color: "bg-slate-100 text-slate-700" };
                      const bt = req.bloodType?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || req.bloodType;

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Donor Name & Contact */}
                          <td className="p-3.5">
                            <div className="font-bold text-slate-800 text-sm">
                              {req.donor?.user?.name || "متبرع منزلي"}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              <span dir="ltr">{req.phone}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              حجز: #{req.bookingNumber}
                            </div>
                          </td>

                          {/* Blood Type */}
                          <td className="p-3.5">
                            <span className="bg-red-600 text-white font-black px-2.5 py-1 rounded-lg shadow-sm inline-block">
                              {bt}
                            </span>
                          </td>

                          {/* Region / Area */}
                          <td className="p-3.5">
                            <div className="font-bold text-slate-800">{req.district}</div>
                            <div className="text-[11px] text-slate-500">{req.city}</div>
                          </td>

                          {/* Date & Time Slot */}
                          <td className="p-3.5">
                            <div className="font-bold text-slate-800">
                              {new Date(req.scheduledDate).toLocaleDateString("ar-SA")}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>{req.timeSlot}</span>
                            </div>
                          </td>

                          {/* Medical Team */}
                          <td className="p-3.5">
                            {req.medicalTeam ? (
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-1 rounded-lg">
                                {req.medicalTeam.name}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium">لم يتم التعيين</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full font-bold border ${st.color}`}>
                              {st.label}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {!isDonor && (
                                <>
                                  <button
                                    onClick={() => setAssignModalItem(req)}
                                    title="تعيين الفريق الطبي"
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold p-2 rounded-xl border border-blue-200 transition-all"
                                  >
                                    <Users className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => setOnSiteModalItem(req)}
                                    title="توثيق التبرع الميداني"
                                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold p-2 rounded-xl border border-red-200 transition-all"
                                  >
                                    <Droplet className="w-4 h-4 fill-current" />
                                  </button>
                                </>
                              )}

                              {isDonor && req.qrCode && (
                                <button
                                  onClick={() => alert(`رمز التحقق الميداني لحجزك: ${req.bookingNumber}`)}
                                  className="bg-slate-900 text-white font-bold p-2 rounded-xl shadow-sm"
                                  title="عرض رمز QR"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────── VIEW 2: ROUTES VIEW ──────────────── */}
      {activeTab === "ROUTES" && !isDonor && (
        <VisitRoutesView requests={requests} onRefresh={fetchRequests} />
      )}

      {/* ──────────────── VIEW 3: ANALYTICS VIEW ──────────────── */}
      {activeTab === "ANALYTICS" && !isDonor && (
        <HomeAnalyticsView />
      )}

      {/* Modals */}
      <AssignTeamModal
        requestItem={assignModalItem}
        isOpen={!!assignModalItem}
        onClose={() => setAssignModalItem(null)}
        onSuccess={fetchRequests}
      />

      <OnSiteDonationModal
        requestItem={onSiteModalItem}
        isOpen={!!onSiteModalItem}
        onClose={() => setOnSiteModalItem(null)}
        onSuccess={fetchRequests}
      />
    </div>
  );
}
