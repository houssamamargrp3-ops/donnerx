import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let teams = await prisma.medicalTeam.findMany({
      include: {
        homeRequests: {
          where: {
            status: { in: ["PENDING", "REVIEW", "CONFIRMED", "IN_ROUTE", "ARRIVED"] }
          }
        },
        visits: true,
      }
    });

    // If no teams exist yet, seed default medical teams
    if (teams.length === 0) {
      const defaultTeams = [
        { name: "فريق 01 - المنطقة الشمالية", leaderName: "د. أحمد علي", phone: "0501112233", area: "المنطقة الشمالية" },
        { name: "فريق 02 - المنطقة الجنوبية", leaderName: "د. سارة محمود", phone: "0502223344", area: "المنطقة الجنوبية" },
        { name: "فريق 03 - المنطقة الشرقية", leaderName: "د. خالد العتيبي", phone: "0503334455", area: "المنطقة الشرقية" },
        { name: "فريق 04 - المنطقة الغربية", leaderName: "د. مريم الشمري", phone: "0504445566", area: "المنطقة الغربية" },
      ];

      for (const t of defaultTeams) {
        await prisma.medicalTeam.create({ data: t });
      }

      teams = await prisma.medicalTeam.findMany({
        include: {
          homeRequests: true,
          visits: true,
        }
      });
    }

    return NextResponse.json(teams);
  } catch (error: any) {
    console.error("Error fetching medical teams:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, leaderName, phone, area } = body;

    if (!name) {
      return NextResponse.json({ error: "اسم الفريق مطلوب" }, { status: 400 });
    }

    const team = await prisma.medicalTeam.create({
      data: {
        name,
        leaderName: leaderName || null,
        phone: phone || null,
        area: area || null,
      },
    });

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    console.error("Error creating medical team:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
