"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, CalendarDays, MapPin, Users, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CampaignsClient({ initialCampaigns, userRole }: { initialCampaigns: any[], userRole: string }) {
  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userRole === "CENTER_STAFF";

  const [formData, setFormData] = useState({
    name: "", description: "", organizer: "", location: "", city: "", startDate: "", endDate: "", capacity: ""
  });

  const router = useRouter();

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", organizer: "", location: "", city: "", startDate: "", endDate: "", capacity: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (camp: any) => {
    setEditingId(camp.id);
    setFormData({
      name: camp.name || "",
      description: camp.description || "",
      organizer: camp.organizer || "",
      location: camp.location || "",
      city: camp.city || "",
      startDate: camp.startDate ? new Date(camp.startDate).toISOString().slice(0, 16) : "",
      endDate: camp.endDate ? new Date(camp.endDate).toISOString().slice(0, 16) : "",
      capacity: camp.capacity ? String(camp.capacity) : ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/campaigns/${editingId}` : "/api/campaigns";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchCampaigns();
        if (!editingId) {
          alert("تم إنشاء الحملة وإرسال إشعارات للمتبرعين بنجاح!");
        } else {
          alert("تم تحديث بيانات الحملة بنجاح!");
        }
      } else {
        alert("فشل في حفظ بيانات الحملة.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الحملة بشكل نهائي؟")) {
      try {
        const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchCampaigns();
          alert("تم الحذف بنجاح.");
        } else {
          alert("فشل حذف الحملة.");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <span className="badge-success">نشطة</span>;
      case "PUBLISHED": return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">مجدولة</span>;
      case "COMPLETED": return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">منتهية</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="labo-page-title">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">{isAdmin ? "إدارة الحملات" : "حملات التبرع"}</h1>
        </div>
        {isAdmin && (
          <button 
            onClick={openCreateModal}
            className="labo-btn-primary"
          >
            <Plus className="w-4 h-4" />
            حملة جديدة
          </button>
        )}
      </div>

      {/* Campaigns Table */}
      <div className="labo-card overflow-hidden">
        {campaigns.length > 0 ? (
          <div className="labo-table-wrapper">
            <table className="labo-table">
              <thead>
                <tr>
                  <th>اسم الحملة</th>
                  <th>المنظم</th>
                  <th>المدينة / الموقع</th>
                  <th>التاريخ</th>
                  <th>السعة</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp.id}>
                    <td className="font-bold text-slate-800">{camp.name}</td>
                    <td className="text-slate-600">{camp.organizer}</td>
                    <td>
                      <div className="text-slate-800 font-medium">{camp.city}</div>
                      <div className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {camp.location}
                      </div>
                    </td>
                    <td>
                      <div className="text-slate-800 flex items-center gap-1">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        {new Date(camp.startDate).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="w-4 h-4" /> {camp.registered} / {camp.capacity}
                      </div>
                    </td>
                    <td>{getStatusBadge(camp.status)}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/campaigns/${camp.id}`} className="labo-action-btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200" title="عرض التفاصيل">
                          <Eye className="w-4 h-4"/>
                        </Link>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEditModal(camp)} className="labo-action-btn labo-action-edit" title="تعديل">
                              <Edit3 className="w-4 h-4"/>
                            </button>
                            <button onClick={() => handleDelete(camp.id)} className="labo-action-btn labo-action-delete" title="حذف">
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>لا توجد حملات حالياً. انقر على "حملة جديدة" لإنشاء أول حملة.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? "تعديل بيانات الحملة" : "إنشاء حملة تبرع بالدم"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">اسم الحملة *</label>
                  <input required type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الجهة المنظمة *</label>
                  <input required type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">المدينة *</label>
                  <input required type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الموقع تفصيلياً *</label>
                  <input required type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ البدء *</label>
                  <input required type="datetime-local" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ الانتهاء *</label>
                  <input required type="datetime-local" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">السعة (شخص) *</label>
                  <input required type="number" min="1" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">وصف الحملة</label>
                <textarea rows={3} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="labo-btn-outline">
                  إلغاء
                </button>
                <button type="submit" className="labo-btn-primary">
                  {editingId ? "تحديث الحملة" : "إنشاء ونشر الحملة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
