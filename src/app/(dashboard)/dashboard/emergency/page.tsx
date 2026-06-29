import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Plus, MapPin, Droplet, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "نداءات الطوارئ" };

export default async function EmergencyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";
  const isDonor = role === "DONOR";

  const formatBloodType = (type: string) => {
    return type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  if (isDonor) {
    // DONOR VIEW: Show active emergencies in their city
    const donor = await prisma.donor.findUnique({ where: { userId: session.user.id } });
    if (!donor) return <div>لا يوجد ملف طبي.</div>;

    const activeRequests = await prisma.emergencyRequest.findMany({
      where: { 
        status: "OPEN",
        city: donor.city || undefined,
        bloodType: donor.bloodType // Ideal matching
      },
      orderBy: { createdAt: "desc" },
      include: {
        responses: {
          where: { donorId: donor.id } // check if this donor responded
        }
      }
    });

    return (
      <div className="space-y-6 mt-4">
        <div className="labo-page-title mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              نداءات الطوارئ العاجلة
            </h1>
            <p className="text-slate-500 text-sm mt-1">المستشفيات في مدينتك بحاجة ماسة لفصيلة دمك الآن.</p>
          </div>
        </div>

        {activeRequests.length === 0 ? (
          <div className="labo-card p-12 text-center text-slate-500">
            <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">لا توجد نداءات طوارئ حالياً</h2>
            <p>الحمد لله، لا يوجد احتياج طارئ لفصيلة دمك في مدينتك حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeRequests.map(req => {
              const hasResponded = req.responses.length > 0;
              
              return (
                <div key={req.id} className="labo-card p-6 border-t-4 border-t-red-600 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{req.hospitalName}</h3>
                      <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" /> {req.city}
                      </p>
                    </div>
                    <div className="bg-red-50 text-red-600 font-black text-xl px-3 py-1 rounded-lg border border-red-100 flex items-center gap-1">
                      <Droplet className="w-4 h-4 fill-red-600" /> {formatBloodType(req.bloodType)}
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg mb-4 text-sm text-red-800 border border-red-100 flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>المستشفى بحاجة ماسة إلى <strong>{req.unitsNeeded} أكياس</strong>. النداء موجه لك شخصياً بناءً على فصيلة دمك وتواجدك في نفس المدينة.</p>
                  </div>

                  {hasResponded ? (
                    <div className="w-full text-center py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                      لقد قمت بتلبية هذا النداء. شكرًا لك!
                    </div>
                  ) : (
                    <form action={async () => {
                      "use server";
                      await prisma.emergencyResponse.create({
                        data: { requestId: req.id, donorId: donor.id }
                      });
                      // In real app, trigger notification to hospital here
                    }}>
                      <button className="labo-btn-danger w-full justify-center">
                        أنا قادم للتبرع الآن
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ADMIN / CENTER VIEW
  const centerRequests = await prisma.emergencyRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      responses: {
        include: { donor: { include: { user: true } } }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            إدارة نداءات الطوارئ
          </h1>
          <p className="text-slate-500 text-sm mt-1">متابعة استجابات المتبرعين وإطلاق نداءات عاجلة لفصائل الدم.</p>
        </div>
        
        <Link href="/dashboard/emergency/new" className="labo-btn-danger flex items-center gap-2">
          <Plus className="w-4 h-4" /> إنشاء نداء طوارئ
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {centerRequests.length === 0 ? (
           <div className="labo-card p-12 text-center text-slate-500">
             <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
             <p>لا يوجد نداءات طوارئ نشطة حالياً.</p>
           </div>
        ) : (
          centerRequests.map(req => (
            <div key={req.id} className="labo-card p-0 overflow-hidden border-t-4 border-t-red-500">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-800">{req.hospitalName}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${req.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {req.status === 'OPEN' ? 'نشط' : 'مكتمل'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">الاحتياج: {req.unitsNeeded} أكياس | الفصيلة: {formatBloodType(req.bloodType)}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-800">{req.responses.length}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">متبرع قادم</p>
                </div>
              </div>
              
              <div className="p-0">
                {req.responses.length > 0 ? (
                  <table className="labo-table w-full">
                    <thead>
                      <tr>
                        <th>المتبرع</th>
                        <th>الفصيلة</th>
                        <th>وقت الاستجابة</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {req.responses.map(res => (
                        <tr key={res.id}>
                          <td className="font-bold text-slate-800">{res.donor.user?.name}</td>
                          <td><span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">{formatBloodType(res.donor.bloodType)}</span></td>
                          <td dir="ltr" className="text-right text-slate-600">{new Intl.DateTimeFormat('ar-SA', { hour: '2-digit', minute: '2-digit' }).format(res.respondedAt)}</td>
                          <td><span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold">{res.status === 'PENDING' ? 'في الطريق' : res.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    بانتظار استجابة المتبرعين...
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
