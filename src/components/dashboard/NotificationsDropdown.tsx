"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Clock, AlertTriangle, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" })
      });
      if (res.ok) {
        setUnreadCount(0);
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY_REQUEST": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "APPOINTMENT_REMINDER": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "CAMPAIGN_INVITE": return <CalendarDays className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 rounded-xl overflow-hidden shadow-xl z-50 bg-white border border-slate-100 animate-scale-in">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-800">الإشعارات</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-slate-50 flex gap-3 ${!notif.isRead ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <p className={`text-sm ${!notif.isRead ? 'font-bold text-slate-800' : 'text-slate-700'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(notif.createdAt).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">لا توجد إشعارات جديدة</p>
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
            <Link href="/dashboard/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              عرض كل الإشعارات
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
