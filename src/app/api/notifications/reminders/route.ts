import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

// This endpoint runs via CRON or admin trigger to send intelligent donation reminders:
// 1. 12-Hour Pre-Campaign Reminders (with dietary, sleep, hydration, and BP instructions)
// 2. 12-Hour Pre-Appointment Reminders (with health & preparation checklist)
// 3. 3-Month Eligibility Reminders (for donors ready for their next donation)
export async function GET(req: Request) {
  try {
    // Basic security to prevent abuse (In real app, verify cron secret)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "dev-secret"}`) {
      if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let campaignReminders = 0;
    let appointmentReminders = 0;
    let eligibilityReminders = 0;

    // ─────────────────────────────────────────────────────────────
    // 1. 12-HOUR CAMPAIGN REMINDERS
    // ─────────────────────────────────────────────────────────────
    // Find active or scheduled campaigns starting in the next 12 to 24 hours
    const upcomingCampaigns = await prisma.campaign.findMany({
      where: {
        startDate: {
          gte: now,
          lte: in24Hours,
        },
        status: { in: ["ACTIVE", "PUBLISHED"] },
      },
    });

    if (upcomingCampaigns.length > 0) {
      // Find all eligible donors
      const eligibleDonors = await prisma.donor.findMany({
        where: { eligibilityStatus: "ELIGIBLE" },
        select: { userId: true, city: true },
      });

      for (const campaign of upcomingCampaigns) {
        for (const donor of eligibleDonors) {
          // Check if notification already sent for this campaign in the last 24 hours
          const existing = await prisma.notification.findFirst({
            where: {
              userId: donor.userId,
              type: "CAMPAIGN_INVITE",
              createdAt: { gte: oneDayAgo },
              message: { contains: campaign.name },
            },
          });

          if (!existing) {
            await prisma.notification.create({
              data: {
                userId: donor.userId,
                type: "CAMPAIGN_INVITE" as NotificationType,
                title: `🩸 تذكير: تبدأ حملة "${campaign.name}" خلال 12 ساعة!`,
                message: `تنطلق الحملة قريباً في ${campaign.location || campaign.city}! 🩺 شروط هامة لضمان قبول التبرع: 1) شرب 500 مل ماء على الأقل، 2) نوم كافٍ 7-8 ساعات، 3) تناول وجبة متوازنة وتجنب الدهون، 4) التأكد من استقرار ضغط الدم.`,
                data: { campaignId: campaign.id, hoursRemaining: 12 },
              },
            });
            campaignReminders++;
          }
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. 12-HOUR APPOINTMENT REMINDERS
    // ─────────────────────────────────────────────────────────────
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: in24Hours,
        },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      include: {
        donor: true,
        center: true,
      },
    });

    for (const appt of upcomingAppointments) {
      if (!appt.donor?.userId) continue;

      const existing = await prisma.notification.findFirst({
        where: {
          userId: appt.donor.userId,
          type: "APPOINTMENT_REMINDER",
          createdAt: { gte: oneDayAgo },
        },
      });

      if (!existing) {
        const centerName = appt.center?.name || "المركز الطبي";
        await prisma.notification.create({
          data: {
            userId: appt.donor.userId,
            type: "APPOINTMENT_REMINDER" as NotificationType,
            title: `⏰ تذكير: موعد تبرعك بالدم بعد 12 ساعة في ${centerName}`,
            message: `موعدك غداً! 📋 إرشادات هامة قبل الحضور: نم جيداً (7-8 ساعات)، تناول وجبة خفيفة غنية بالحديد، اشرب الكثير من السوائل وتجنب التدخين قبل التبرع بساعتين. حضورك ينقذ حياة!`,
            data: { appointmentId: appt.id, scheduledAt: appt.scheduledAt },
          },
        });
        appointmentReminders++;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. 3-MONTH RE-ELIGIBILITY REMINDERS
    // ─────────────────────────────────────────────────────────────
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const eligibleDonors = await prisma.donor.findMany({
      where: {
        lastDonationDate: { lte: threeMonthsAgo },
        eligibilityStatus: "ELIGIBLE",
      },
    });

    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    for (const donor of eligibleDonors) {
      const recentReminder = await prisma.notification.findFirst({
        where: {
          userId: donor.userId,
          type: "NEXT_DONATION_DATE",
          createdAt: { gte: fourteenDaysAgo },
        },
      });

      if (!recentReminder) {
        await prisma.notification.create({
          data: {
            userId: donor.userId,
            type: "NEXT_DONATION_DATE" as NotificationType,
            title: "🎉 أنت مؤهل للتبرع مرة أخرى!",
            message: "لقد مرت 3 أشهر منذ آخر تبرع لك. دمك قد ينقذ حياة جديدة اليوم! هل تود حجز موعد؟",
          },
        });
        eligibilityReminders++;
      }
    }

    return NextResponse.json({
      success: true,
      remindersSummary: {
        campaignReminders,
        appointmentReminders,
        eligibilityReminders,
        totalSent: campaignReminders + appointmentReminders + eligibilityReminders,
      },
    });
  } catch (error: any) {
    console.error("Reminders API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
