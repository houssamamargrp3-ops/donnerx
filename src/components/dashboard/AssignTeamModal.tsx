"use client";

import { useState, useEffect } from "react";
import {
  X,
  Truck,
  Users,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Droplet,
  CheckCircle2,
  AlertTriangle,
  Send
} from "lucide-react";

interface AssignTeamModalProps {
  requestItem: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignTeamModal({
  requestItem,
  isOpen,
  onClose,
  onSuccess,
}: AssignTeamModalProps) {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [status, setStatus] = useState("CONFIRMED");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
      if (requestItem?.medicalTeamId) {
        setSelectedTeamId(requestItem.medicalTeamId);
      }
      if (requestItem?.status) {
        setStatus(requestItem.status === "PENDING" ? "CONFIRMED" : requestItem.status);
      }
    }
  }, [isOpen, requestItem]);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/medical-teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data || []);
      }
    } catch (_) {}
  };

  if (!isOpen || !requestItem) return null;

  const handleSave = async () => {
    setErrorMsg("");
    if (!selectedTeamId) {
      setErrorMsg("يرجى اختيار الفريق الطبي الميداني.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/home-donations/${requestItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicalTeamId: selectedTeamId,
          status,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "حدث خطأ أثناء تعيين الفريق.");
      } else {
        alert("تم تعيين الفريق الطبي وتحديث حالة الطلب بنجاح 🚑");
        onSuccess();
        onClose();
      }
    } catch (err) {
      setErrorMsg("حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);
  const scheduledVisitsForTeam = selectedTeam?.homeRequests?.length || 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">تعيين الفريق الطبي الميداني</h3>
              <p className="text-xs text-slate-500 font-mono">حجز رقم: {requestItem.bookingNumber}</p>
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

        {/* Donor Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">👤 اسم المتبرع:</span>
            <span className="text-slate-900">{requestItem.donor?.user?.name || "غير محدد"}</span>
          </div>
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">🩸 فصيلة الدم:</span>
            <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded-lg">
              {requestItem.bloodType}
            </span>
          </div>
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">📍 المنطقة والعنوان:</span>
            <span className="text-slate-800">{requestItem.district} - {requestItem.address}</span>
          </div>
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">📞 رقم الاتصال:</span>
            <span dir="ltr" className="text-blue-600">{requestItem.phone}</span>
          </div>
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">📅 تاريخ الموعد والفترة:</span>
            <span className="text-slate-800">
              {new Date(requestItem.scheduledDate).toLocaleDateString("ar-SA")} ({requestItem.timeSlot})
            </span>
          </div>
        </div>

        {/* Team Selector & Schedule Check */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اختيار الفريق الطبي للمهمة الميدانية *
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 outline-none focus:border-red-500 text-xs md:text-sm font-bold cursor-pointer"
            >
              <option value="">-- اختر من قائمة الفرق الميدانية المتاحة --</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.leaderName || "طبيب مسئول"}) - تغطية: {t.area || "عامة"}
                </option>
              ))}
            </select>
          </div>

          {selectedTeam && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>الزيارات المجدولة لهذا الفريق:</span>
              </span>
              <span className="bg-emerald-600 text-white font-black px-2 py-0.5 rounded-md">
                {scheduledVisitsForTeam} زيارات نشطة
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">تحديث حالة الطلب</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 outline-none focus:border-red-500 text-xs md:text-sm font-bold cursor-pointer"
            >
              <option value="CONFIRMED">مؤكد (تم التخصيص والموافقة)</option>
              <option value="IN_ROUTE">في الطريق (الفريق متوجه للعنوان)</option>
              <option value="ARRIVED">تم الوصول (الفريق في منزل المتبرع)</option>
              <option value="CANCELLED">إلغاء الطلب</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">تعليمات أو ملاحظات للفريق</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب أي ملاحظات لوجستية أو إرشادات للوصول..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-medium"
            />
          </div>
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
            onClick={handleSave}
            className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow-md shadow-red-200 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="spinner border-t-white w-4 h-4 border-2 rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>تأكيد التعيين وتنبيه المتبرع</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
