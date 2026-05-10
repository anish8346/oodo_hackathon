import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, tripInclude } from "@/lib/traveloop";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params;
  const share = await prisma.sharedItinerary.update({
    where: { publicSlug: slug },
    data: { viewCount: { increment: 1 } },
    include: { trip: { include: tripInclude } },
  }).catch(() => null);
  if (!share?.isActive) return jsonError("Public itinerary not found", 404);
  return NextResponse.json(share);
}
