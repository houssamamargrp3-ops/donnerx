import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Bell, CheckCircle2, AlertTriangle, Megaphone, Heart, Calendar } from "lucide-react";
import PushNotificationPrompt from "@/components/dashboard/PushNotificationPrompt";

export const metadata = { title: "مركز الإشعارات والإنذارات | HayatLink" };

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY_REQUEST":
        return <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />;
      case "CAMPAIGN_INVITE":
        return <Megaphone className="w-5 h-5 text-blue-500 shrink-0" />;
      case "APPOINTMENT_REMINDER":
        return <Calendar className="w-5 h-5 text-amber-500 shrink-0" />;
      case "DONATION_RECORDED":
        return <Heart className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500 shrink-0" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up mt-4">
      <div className="labo-page-title mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-600" />
            مركز الإشعارات وتنبيهات الهاتف
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            تابع كافة نداءات الطوارئ، تذكيرات المواعيد، ودعوات حملات التبرع بالدم.
          </p>
        </div>
      </div>

      {/* Push & SMS Notifications Activator (Duolingo Style) */}
      <PushNotificationPrompt />

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm flex justify-between items-center">
          <span>سجل التنبيهات والرسائل الواردة ({notifications.length})</span>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-600">لا توجد إشعارات جديدة حالياً.</p>
              <p className="text-xs text-slate-400 mt-1">ستظهر هنا أي تنبيهات طوارئ أو تذكيرات قادمة.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 transition-colors flex items-start gap-3 ${
                  n.isRead ? "bg-white" : "bg-red-50/30"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                      {new Intl.DateTimeFormat("ar-SA", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(n.createdAt))}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
