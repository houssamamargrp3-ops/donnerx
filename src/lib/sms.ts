/**
 * DONNER.X SMS Gateway Module
 * Sends SMS alerts directly to donors' mobile numbers for:
 * 1. Urgent Emergency Requests (نداءات الطوارئ العاجلة)
 * 2. 12-Hour Pre-Campaign / Appointment Reminders (تذكيرات المواعيد والحملات)
 */

export interface SMSOptions {
  to: string; // Phone number (e.g. +213xxxxxxxxx or 06xxxxxxxx)
  message: string;
  type?: "EMERGENCY" | "REMINDER" | "CAMPAIGN";
}

export async function sendSMS({ to, message, type = "EMERGENCY" }: SMSOptions) {
  try {
    const cleanPhone = to.trim();
    if (!cleanPhone) {
      console.warn("SMS Error: No phone number provided");
      return { success: false, error: "رقم الهاتف غير متاح" };
    }

    console.log(`\n========================================`);
    console.log(`📱 [DONNER.X SMS OUTBOUND] -> ${cleanPhone}`);
    console.log(`TYPE: ${type}`);
    console.log(`MESSAGE: ${message}`);
    console.log(`TIMESTAMP: ${new Date().toISOString()}`);
    console.log(`========================================\n`);

    // Integration Hook for Twilio / InfoBip / Local Gateway
    const smsApiKey = process.env.SMS_API_KEY;
    const smsApiUrl = process.env.SMS_API_URL;

    if (smsApiKey && smsApiUrl) {
      const response = await fetch(smsApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${smsApiKey}`,
        },
        body: JSON.stringify({
          recipient: cleanPhone,
          body: message,
          sender: process.env.SMS_SENDER_ID || "DONNER.X",
        }),
      });

      if (!response.ok) {
        console.error("SMS Gateway API Error:", await response.text());
        return { success: false, error: "فشل الإرسال عبر مزود الـ SMS" };
      }
    }

    return { success: true, deliveredTo: cleanPhone };
  } catch (error: any) {
    console.error("SMS Dispatch Error:", error);
    return { success: false, error: error.message };
  }
}
