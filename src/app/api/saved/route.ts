import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser } from "@/lib/traveloop";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const saved = await prisma.savedDestination.findMany({
    where: { userId: user.id },
    orderBy: { savedAt: "desc" },
    include: { city: true },
  });
  return NextResponse.json(saved);
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = await request.json();
  const saved = await prisma.savedDestination.upsert({
    where: { userId_cityId: { userId: user.id, cityId: body.cityId } },
    create: { userId: user.id, cityId: body.cityId },
    update: {},
  });
  return NextResponse.json(saved, { status: 201 });
}
