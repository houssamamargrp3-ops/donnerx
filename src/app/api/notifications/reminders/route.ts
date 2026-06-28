import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

// This would typically be called by a CRON job (e.g. Vercel Cron)
// For now, we expose it as a GET endpoint that an admin can trigger or a chron job can ping
export async function GET(req: Request) {
  try {
    // Basic security to prevent abuse (In real app, verify cron secret)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`) {
      // For dev purposes, we'll let it pass if no CRON_SECRET is set
      if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Find donors who donated > 3 months ago AND haven't been notified recently
    // Simplified logic: Just find donors whose lastDonationDate <= 3 months ago
    const eligibleDonors = await prisma.donor.findMany({
      where: {
        lastDonationDate: {
          lte: threeMonthsAgo
        },
        eligibilityStatus: "ELIGIBLE"
      }
    });

    let notificationsCreated = 0;

    for (const donor of eligibleDonors) {
      // Check if we already sent a reminder in the last 14 days
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const recentReminder = await prisma.notification.findFirst({
        where: {
          userId: donor.userId,
          type: "NEXT_DONATION_DATE",
          createdAt: {
            gte: fourteenDaysAgo
          }
        }
      });

      if (!recentReminder) {
        await prisma.notification.create({
          data: {
            userId: donor.userId,
            type: "NEXT_DONATION_DATE" as NotificationType,
            title: "🎉 أنت مؤهل للتبرع مرة أخرى!",
            message: "لقد مرت 3 أشهر منذ آخر تبرع لك. دمك قد ينقذ حياة جديدة اليوم! هل تود حجز موعد؟",
          }
        });
        notificationsCreated++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      checkedDonors: eligibleDonors.length,
      remindersSent: notificationsCreated 
    });

  } catch (error: any) {
    console.error("Reminders API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
