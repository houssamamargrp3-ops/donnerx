"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Info } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.filter((n: Notification) => !n.isRead).length || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "POST" });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        style={{ background: isOpen ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)", border: "1px solid #1e1e3a" }}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -left-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
            style={{ background: "#dc2626", fontSize: "10px" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-2 w-80 rounded-xl overflow-hidden shadow-xl z-50 animate-scale-in"
          style={{ background: "#16162a", border: "1px solid #1e1e3a", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center justify-between p-3 border-b border-slate-800">
            <h3 className="text-white font-bold text-sm">الإشعارات</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> تحديد كقراءة
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">لا توجد إشعارات جديدة</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 transition-colors hover:bg-white/5 ${!n.isRead ? 'bg-red-500/5' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>{n.title}</h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit" }).format(new Date(n.createdAt))}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
