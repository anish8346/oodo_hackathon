import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  const body = await request.json();
  const stops = Array.isArray(body.stops) ? body.stops : [];
  await prisma.$transaction(
    stops.map((stop: { id: string; stopOrder: number }) =>
      prisma.tripStop.update({ where: { id: stop.id, tripId }, data: { stopOrder: stop.stopOrder } })
    )
  );
  return NextResponse.json({ ok: true });
}
