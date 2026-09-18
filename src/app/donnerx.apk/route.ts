import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "hayatlink.apk");
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse("APK file not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const stat = fs.statSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="HayatLink.apk"',
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving APK:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
