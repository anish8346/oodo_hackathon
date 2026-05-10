import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/traveloop";

type Context = { params: Promise<{ cityId: string }> };

export async function GET(_request: Request, context: Context) {
  const { cityId } = await context.params;
  const city = await prisma.city.findUnique({
    where: { id: cityId },
    include: { activities: { orderBy: [{ isPopular: "desc" }, { avgRating: "desc" }] } },
  });
  if (!city) return jsonError("City not found", 404);
  return NextResponse.json(city);
}
