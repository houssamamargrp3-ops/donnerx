import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createReadStream } from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "hayatlink.apk");

    if (!fs.existsSync(filePath)) {
      // Try donnerx.apk as fallback
      const fallback = path.join(process.cwd(), "public", "donnerx.apk");
      if (!fs.existsSync(fallback)) {
        return new NextResponse("APK not found", { status: 404 });
      }
    }

    const stat = fs.statSync(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": "attachment; filename=\"HayatLink.apk\"",
        "Content-Length": stat.size.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("APK download error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
