import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ cityId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { cityId } = await context.params;
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const maxCost = searchParams.get("maxCost");
  const maxDuration = searchParams.get("maxDuration");
  const activities = await prisma.cityActivity.findMany({
    where: {
      cityId,
      ...(category ? { category } : {}),
      ...(maxCost ? { estimatedCost: { lte: Number(maxCost) } } : {}),
      ...(maxDuration ? { durationMinutes: { lte: Number(maxDuration) } } : {}),
    },
    orderBy: [{ isPopular: "desc" }, { avgRating: "desc" }],
  });
  return NextResponse.json(activities);
}
